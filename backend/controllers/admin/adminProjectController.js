const Project = require('../../models/Project');
const User = require('../../models/User');
const mintController = require('./mintController');


const REJECTABLE_STATUSES = ['pending', 'assigned', 'in_progress', 'verified'];

// GET /api/admin/projects?status=pending
async function getReviewQueue(req, res) {
  try {
    const status = req.query.status || 'pending';
    const projects = await Project.findByStatus(status);
    res.json({ projects });
  } catch (err) {
    console.error('Get review queue error:', err);
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
}

// GET /api/admin/projects/:id  — full detail, no ownership restriction (admin sees everything)
async function getProjectDetails(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    console.error('Get project details error:', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
}

// PUT /api/admin/projects/:id/approve
async function approveProject(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.status !== 'verified') {
      return res.status(400).json({ error: 'Only verified projects can be approved' });
    }

    await Project.changeProjectStatus(req.params.id, 'approved');
    const approvedProject = await Project.findProjectById(req.params.id);

    const mintResult = await mintController.attemptMint(approvedProject);

    if (!mintResult.minted) {
      return res.status(201).json({
        message: `Project approved. Auto-mint did not complete yet: ${mintResult.reason}. It can be retried once resolved.`,
        project: approvedProject,
      });
    }

    const mintedProject = await Project.findProjectById(req.params.id);
    res.status(201).json({
      message: 'Project approved and credits minted automatically',
      project: mintedProject,
      batch: mintResult.batch,
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

    const updated = await Project.changeProjectStatus(req.params.id, 'rejected');
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
    res.json({ message: 'Agent removed successfully', project: updated });
  } catch (err) {
    console.error('Remove agent error:', err);
    res.status(500).json({ error: 'Failed to remove agent' });
  }
}

module.exports = { getReviewQueue, getProjectDetails, approveProject, rejectProject, assignAgent, removeAgent };