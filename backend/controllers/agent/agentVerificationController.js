const Project = require('../../models/Project');
const Verification = require('../../models/Verification');

// POST /api/agent/projects/:id/verify/initial
// body: { gps_lat, gps_lng, photo_url, notes }
// photo_url is obtained by the agent calling POST /api/upload/kyc
// with purpose='verification_photo' first, then using the returned storagePath
// (or the frontend may send the full signed URL — both are accepted here).
async function submitInitialVerification(req, res) {
  try {
    const { gps_lat, gps_lng, photo_url, notes, overridden_expected_completion_date } = req.body;

    if (gps_lat === undefined || gps_lng === undefined) {
      return res.status(400).json({ error: 'gps_lat and gps_lng are required' });
    }
    if (!photo_url) {
      return res.status(400).json({
        error: 'photo_url is required — upload a field photo via POST /api/upload/kyc first, then include the returned storagePath as photo_url.',
      });
    }

    if (overridden_expected_completion_date) {
      const overrideDate = new Date(overridden_expected_completion_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (overrideDate < today) {
        return res.status(400).json({ error: 'Overridden completion date cannot be in the past.' });
      }
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }
    if (project.status !== 'assigned') {
      return res.status(400).json({
        error: `Cannot submit initial verification — project status is "${project.status}", expected "assigned"`,
      });
    }

    const { kyc_docs_status } = project;
    if (!kyc_docs_status || kyc_docs_status.aadhaar !== 'approved' || kyc_docs_status.land_deed !== 'approved' || kyc_docs_status.live_photo !== 'approved') {
      return res.status(400).json({
        error: 'Cannot submit initial verification — all KYC documents (Aadhaar, Land Deed, Live Photo) must be approved first.'
      });
    }

    const report = await Verification.createVerificationReport(project.id, req.user.id, 'initial', {
      gps_lat, gps_lng, photo_url, notes,
    });

    await Project.setExpectedCompletionDate(project.id, overridden_expected_completion_date);
    const updatedProject = await Project.changeProjectStatus(project.id, 'in_progress');

    res.status(201).json({
      message: `Initial verification submitted. Project is now in progress. Completion verification can happen on or after ${updatedProject.expected_completion_date}.`,
      report,
      project: updatedProject,
    });
  } catch (err) {
    console.error('Submit initial verification error:', err);
    res.status(500).json({ error: 'Failed to submit initial verification' });
  }
}

// POST /api/agent/projects/:id/verify/completion
// body: { gps_lat, gps_lng, photo_url, notes, verified_co2_amount }
async function submitCompletionVerification(req, res) {
  try {
    const { gps_lat, gps_lng, photo_url, notes, verified_co2_amount } = req.body;

    if (gps_lat === undefined || gps_lng === undefined) {
      return res.status(400).json({ error: 'gps_lat and gps_lng are required' });
    }
    if (!photo_url) {
      return res.status(400).json({
        error: 'photo_url is required — upload a field photo via POST /api/upload/kyc first, then include the returned storagePath as photo_url.',
      });
    }
    if (!verified_co2_amount || verified_co2_amount <= 0) {
      return res.status(400).json({ error: 'A valid verified_co2_amount is required' });
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }
    if (project.status !== 'in_progress') {
      return res.status(400).json({
        error: `Cannot submit completion verification — project status is "${project.status}", expected "in_progress"`,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    if (project.expected_completion_date && today < project.expected_completion_date.toISOString().split('T')[0]) {
      return res.status(400).json({
        error: `Too early — the seller's declared timeline runs until ${project.expected_completion_date.toISOString().split('T')[0]}. Completion verification isn't allowed before then.`,
      });
    }

    const report = await Verification.createVerificationReport(project.id, req.user.id, 'completion', {
      gps_lat, gps_lng, photo_url, notes, verified_co2_amount,
    });

    // Moves to 'verified' — the exact status admin's approveProject requires
    const updatedProject = await Project.changeProjectStatus(project.id, 'verified');

    res.status(201).json({
      message: 'Completion verification submitted. Project is now awaiting admin approval.',
      report,
      project: updatedProject,
    });
  } catch (err) {
    console.error('Submit completion verification error:', err);
    res.status(500).json({ error: 'Failed to submit completion verification' });
  }
}

// POST /api/agent/projects/:id/flag
// body: { category, description }
async function flagProject(req, res) {
  try {
    const { category, description } = req.body;
    
    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required' });
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    // Must be assigned, in_progress, or minted to flag
    if (!['assigned', 'in_progress', 'minted'].includes(project.status)) {
      return res.status(400).json({
        error: `Cannot flag a project with status "${project.status}"`,
      });
    }

    const ProjectIssue = require('../../models/ProjectIssue');
    const issue = await ProjectIssue.createIssue({
      project_id: project.id,
      agent_id: req.user.id,
      category,
      description
    });

    const updatedProject = await Project.changeProjectStatus(project.id, 'flagged');

    res.status(201).json({
      message: 'Project successfully flagged for admin review.',
      issue,
      project: updatedProject,
    });
  } catch (err) {
    console.error('Flag project error:', err);
    res.status(500).json({ error: 'Failed to flag project' });
  }
}

module.exports = { submitInitialVerification, submitCompletionVerification, flagProject };
