const Project = require('../../models/Project');
const Document = require('../../models/Document');


async function getProjectDocuments(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    const documents = await Document.findDocumentsByProject(req.params.id);
    res.json({ documents });
  } catch (err) {
    console.error('Get project documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

async function reviewDocument(req, res) {
  try {
    const { status, rejection_reason } = req.body;
    
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    const document = await Document.updateDocumentStatus(req.params.docId, status, rejection_reason);
    res.json({ message: 'Document updated', document });
  } catch (err) {
    console.error('Review document error:', err);
    res.status(500).json({ error: 'Failed to review document' });
  }
}

async function reviewKycDocument(req, res) {
  try {
    const { docType, status, rejection_reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    if (status === 'rejected' && !rejection_reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }
    const validDocTypes = ['aadhaar', 'land_deed', 'live_photo'];
    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ error: 'Invalid core docType' });
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    const updatedProject = await Project.updateKycDocStatus(project.id, docType, status, rejection_reason);
    res.json({ message: `KYC Document ${docType} marked as ${status}`, project: updatedProject });
  } catch (err) {
    console.error('Review KYC document error:', err);
    res.status(500).json({ error: 'Failed to update KYC document status' });
  }
}

module.exports = { getProjectDocuments, reviewDocument, reviewKycDocument };