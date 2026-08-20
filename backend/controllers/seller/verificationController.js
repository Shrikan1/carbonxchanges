const Verification = require('../../models/Verification');
const Document = require('../../models/Document');
const Project = require('../../models/Project');

// GET /api/verification/:projectId/status
async function getVerificationStatus(req, res) {
  try {
    const project = await Project.findProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }

    const status = await Verification.getVerificationStatus(req.params.projectId);
    return res.status(200).json({
      success: true,
      verification: status,
      project: project
    });
  } catch (err) {
    console.error('Get verification status error:', err);
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
}

// GET /api/verification/:projectId/agent
async function viewAssignedAgent(req, res) {
  try {
    const project = await Project.findProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }
    if (!project.agent_id) {
      return res.status(404).json({ error: 'No agent has been assigned to this project yet' });
    }

    const agent = await Verification.findAssignedAgent(req.params.projectId);
    return res.status(200).json({
    success: true,
    agent
});
  } catch (err) {
    console.error('View assigned agent error:', err);
    res.status(500).json({ error: 'Failed to fetch assigned agent' });
  }
}

// PUT /api/verification/reports/:reportId/response   body: { response_text }
async function submitSellerResponse(req, res) {
  try {
    const { response_text } = req.body;
    if (!response_text) {
      return res.status(400).json({ error: 'response_text is required' });
    }

    const report = await Verification.findReportById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Verification report not found' });
    if (report.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own the project this report belongs to' });
    }

    const updated = await Verification.updateSellerResponse(req.params.reportId, response_text);
    res.json({ message: 'Response submitted', report: updated });
  } catch (err) {
    console.error('Submit seller response error:', err);
    res.status(500).json({ error: 'Failed to submit response' });
  }
}


async function uploadProjectDocuments(req, res) {
  try {
    const { doc_type, ipfs_cid } = req.body;
    if (!doc_type || !ipfs_cid) {
      return res.status(400).json({ error: 'doc_type and ipfs_cid are required' });
    }

    const project = await Project.findProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }

    const document = await Document.createDocument(req.params.projectId, doc_type, ipfs_cid);
    res.status(201).json({ message: 'Document recorded', document });
  } catch (err) {
    console.error('Upload project documents error:', err);
    res.status(500).json({ error: 'Failed to record document' });
  }
}

async function getProjectDocuments(req, res) {
  try {
    const project = await Project.findProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }

    const documents = await Document.findDocumentsByProject(req.params.projectId);
    res.json({ documents });
  } catch (err) {
    console.error('Get project documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

async function deleteProjectDocument(req, res) {
  try {
    const project = await Project.findProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }

    await Document.deleteDocument(req.params.docId);
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
}

module.exports = { getVerificationStatus, viewAssignedAgent, submitSellerResponse, uploadProjectDocuments, getProjectDocuments, deleteProjectDocument };