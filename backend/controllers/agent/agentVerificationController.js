const Project = require('../../models/Project');
const Verification = require('../../models/Verification');

// POST /api/agent/projects/:id/verify/initial
// body: { gps_lat, gps_lng, photo_ipfs_cid, notes }
async function submitInitialVerification(req, res) {
  try {
    const { gps_lat, gps_lng, photo_ipfs_cid, notes } = req.body;

    if (gps_lat === undefined || gps_lng === undefined) {
      return res.status(400).json({ error: 'gps_lat and gps_lng are required' });
    }
    if (!photo_ipfs_cid) {
      return res.status(400).json({ error: 'photo_ipfs_cid is required — a field photo is mandatory evidence' });
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

    const report = await Verification.createVerificationReport(project.id, req.user.id, 'initial', {
      gps_lat, gps_lng, photo_ipfs_cid, notes,
    });

    
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
// body: { gps_lat, gps_lng, photo_ipfs_cid, notes, verified_co2_amount }
async function submitCompletionVerification(req, res) {
  try {
    const { gps_lat, gps_lng, photo_ipfs_cid, notes, verified_co2_amount } = req.body;

    if (gps_lat === undefined || gps_lng === undefined) {
      return res.status(400).json({ error: 'gps_lat and gps_lng are required' });
    }
    if (!photo_ipfs_cid) {
      return res.status(400).json({ error: 'photo_ipfs_cid is required — a field photo is mandatory evidence' });
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
      gps_lat, gps_lng, photo_ipfs_cid, notes, verified_co2_amount,
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

module.exports = { submitInitialVerification, submitCompletionVerification };
