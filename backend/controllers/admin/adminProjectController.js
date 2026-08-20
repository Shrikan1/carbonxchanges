const Project = require('../../models/Project');
const User = require('../../models/User');
const mintController = require('./mintController');
const Paginate = require('../../utils/paginate');
const Verification = require('../../models/Verification');
const Document = require('../../models/Document');
const Notification = require('../../models/Notification');
const { generateAndPinVerificationPdf } = require('../../services/projectPdfService');
const { getSignedUrl, BUCKETS } = require('../../services/supabaseStorageService');
const { query } = require('../../config/db');

const REJECTABLE_STATUSES = ['pending', 'assigned', 'in_progress', 'verified'];

// Adds time-limited signed URLs for any private KYC documents attached to a project.
// Called before returning project detail to admin so they can view the actual docs.
async function enrichWithSignedUrls(project) {
  const enriched = { ...project };
  try {
    if (project.aadhaar_doc_path) {
      enriched.aadhaar_doc_signed_url = await getSignedUrl(BUCKETS.KYC_DOCS, project.aadhaar_doc_path);
    }
    if (project.land_deed_path) {
      enriched.land_deed_signed_url = await getSignedUrl(BUCKETS.KYC_DOCS, project.land_deed_path);
    }
    if (project.live_verification_photo_path) {
      enriched.live_verification_photo_signed_url = await getSignedUrl(
        BUCKETS.KYC_DOCS, project.live_verification_photo_path
      );
    }
  } catch (err) {
    console.error('Error generating signed URLs for project KYC docs:', err.message);
  }
  return enriched;
}

// GET /api/admin/projects?status=pending
async function getReviewQueue(req, res) {
  try {
    const status = req.query.status || 'pending';
    const { page, limit, offset } = Paginate.getPagination(req.query);
    const { rows, total } = await Project.findByStatus(status, { limit, offset });
    return res.status(200).json({
      success: true,
      message: 'Assigned projects fetched successfully',
      ...Paginate.paginatedResponse(rows, total, page, limit),
    });
  } catch (err) {
    console.error('Get review queue error:', err);
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
}

// GET /api/admin/projects/:id  — full detail, with signed URLs for KYC docs
async function getProjectDetails(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Enrich with time-limited signed URLs so admin can view documents directly
    const enrichedProject = await enrichWithSignedUrls(project);
    
    const documents = await Document.findDocumentsByProject(project.id);
    let verification = await Verification.getVerificationStatus(project.id);
    
    // Enrich verification photos with signed URLs
    if (verification) {
      try {
        if (verification.initial_report?.photo_url) {
          verification.initial_report.photo_signed_url = await getSignedUrl(BUCKETS.KYC_DOCS, verification.initial_report.photo_url);
        }
        if (verification.completion_report?.photo_url) {
          verification.completion_report.photo_signed_url = await getSignedUrl(BUCKETS.KYC_DOCS, verification.completion_report.photo_url);
        }
      } catch (err) {
        console.error('Error generating signed URLs for verification photos:');
      }
    }

    res.json({ project: enrichedProject, documents, verification });
  } catch (err) {
    console.error('Get project details error:', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
}

// PUT /api/admin/projects/:id/approve
// Now also generates and pins the verification PDF to IPFS before minting.
async function approveProject(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.status !== 'verified') {
      return res.status(400).json({ error: 'Only verified projects can be approved' });
    }

    await Project.changeProjectStatus(req.params.id, 'approved');
    const approvedProject = await Project.findProjectById(req.params.id);

    // ── Step 1: Generate and pin the full verification PDF to IPFS ────────────
    let verificationPdfCid = null;
    try {
      const verificationStatus = await Verification.getVerificationStatus(project.id);
      verificationPdfCid = await generateAndPinVerificationPdf(
        approvedProject,
        verificationStatus.initial_report,
        verificationStatus.completion_report
      );

      // Store the CID on the project record
      await query(
        `UPDATE projects SET verification_pdf_ipfs_cid = $1, updated_at = NOW() WHERE id = $2`,
        [verificationPdfCid, project.id]
      );

      console.log(`Verification PDF pinned to IPFS — CID: ${verificationPdfCid}`);
    } catch (pdfErr) {
      // PDF generation failure is non-fatal — log it but continue with minting.
      // The admin can regenerate manually if needed.
      console.error('Verification PDF generation warning:', pdfErr.message);
    }

    // ── Step 2: Attempt on-chain mint ────────────────────────────────────────
    const mintResult = await mintController.attemptMint(approvedProject, verificationPdfCid);
    
    // Notify Seller
    await Notification.createNotification(
      project.seller_id,
      'Project Approved',
      `Your project "${project.title}" has been approved by the Admin.`
    );

    if (!mintResult.minted) {
      return res.status(201).json({
        message: `Project approved. Auto-mint did not complete yet: ${mintResult.reason}. It can be retried once resolved.`,
        project: approvedProject,
        verification_pdf_cid: verificationPdfCid,
        verification_pdf_url: verificationPdfCid
          ? `https://gateway.pinata.cloud/ipfs/${verificationPdfCid}`
          : null,
      });
    }
    
    // Notify Seller about minting
    await Notification.createNotification(
      project.seller_id,
      'Credits Minted',
      `Carbon credits for your project "${project.title}" have been successfully minted.`
    );

    const mintedProject = await Project.findProjectById(req.params.id);
    res.status(201).json({
      message: 'Project approved, verification PDF pinned to IPFS, and credits minted automatically',
      project: mintedProject,
      batch: mintResult.batch,
      verification_pdf_cid: verificationPdfCid,
      verification_pdf_url: verificationPdfCid
        ? `https://gateway.pinata.cloud/ipfs/${verificationPdfCid}`
        : null,
    });
  } catch (err) {
    console.error('Approve project error:', err);
    res.status(500).json({ error: 'Failed to approve project' });
  }
}

// PUT /api/admin/projects/:id/reject
async function rejectProject(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!REJECTABLE_STATUSES.includes(project.status)) {
      return res.status(400).json({ error: `Cannot reject a project with status "${project.status}"` });
    }

    const updated = await Project.rejectProject(req.params.id);
    
    await Notification.createNotification(
      project.seller_id,
      'Project Rejected',
      `Unfortunately, your project "${project.title}" has been rejected.`
    );

    res.json({ message: 'Project rejected successfully', project: updated });
  } catch (err) {
    console.error('Reject project error:', err);
    res.status(500).json({ error: 'Failed to reject project' });
  }
}

// PUT /api/admin/projects/:id/assign-agent   body: { agentId }
async function assignAgent(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id) {
      return res.status(400).json({ error: 'An agent is already assigned to this project' });
    }

    const agent = await User.findAgentById(req.body.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const updated = await Project.assignAgent(project.id, agent.id);
    
    // Notify Agent
    await Notification.createNotification(
      agent.id,
      'New Assignment',
      `You have been assigned to verify the project "${project.title}".`
    );
    
    // Notify Seller
    await Notification.createNotification(
      project.seller_id,
      'Agent Assigned',
      `An agent has been assigned to verify your project "${project.title}".`
    );

    res.json({ message: 'Agent assigned successfully', project: updated });
  } catch (err) {
    console.error('Assign agent error:', err);
    res.status(500).json({ error: 'Failed to assign agent' });
  }
}

// PUT /api/admin/projects/:id/remove-agent
async function removeAgent(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!project.agent_id) {
      return res.status(400).json({ error: 'No agent is assigned to this project' });
    }

    const updated = await Project.removeAgent(req.params.id);
    
    await Notification.createNotification(
      project.seller_id,
      'Agent Removed',
      `The assigned agent for your project "${project.title}" has been removed.`
    );

    res.json({ message: 'Agent removed successfully', project: updated });
  } catch (err) {
    console.error('Remove agent error:', err);
    res.status(500).json({ error: 'Failed to remove agent' });
  }
}

module.exports = {
  getReviewQueue, getProjectDetails, approveProject, rejectProject, assignAgent, removeAgent,
};