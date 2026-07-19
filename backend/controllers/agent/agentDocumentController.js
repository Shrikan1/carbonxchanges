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

module.exports = { getProjectDocuments };