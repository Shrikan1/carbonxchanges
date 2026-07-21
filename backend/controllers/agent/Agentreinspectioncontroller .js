const Project = require('../../models/Project');
const Reinspection = require('../../models/Reinspection');

// POST /api/agent/projects/:id/reinspect
// body: { gps_lat, gps_lng, photo_ipfs_cid, notes, reversal_detected, reversal_amount }
//
// Distinct from Initial/Completion verification — this happens AFTER minting,
// as a periodic check during the project's permanence period. If a reversal
// is flagged, this does NOT itself touch any buffer credits — it only
// records the finding. Actually cancelling buffer credits is a separate
// admin-reviewed action (see admin/reversalController.js), so a single
// agent's report can't unilaterally deplete the buffer pool.
async function submitReinspection(req, res) {
  try {
    const { gps_lat, gps_lng, photo_ipfs_cid, notes, reversal_detected, reversal_amount } = req.body;

    if (gps_lat === undefined || gps_lng === undefined) {
      return res.status(400).json({ error: 'gps_lat and gps_lng are required' });
    }
    if (!photo_ipfs_cid) {
      return res.status(400).json({ error: 'photo_ipfs_cid is required — a field photo is mandatory evidence' });
    }
    if (reversal_detected && (!reversal_amount || reversal_amount <= 0)) {
      return res.status(400).json({ error: 'reversal_amount is required and must be positive when reversal_detected is true' });
    }

    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }
    // Re-inspection only makes sense on a project that's actually been
    // minted — nothing to re-check permanence on before credits exist.
    if (project.status !== 'minted') {
      return res.status(400).json({ error: `Cannot re-inspect — project status is "${project.status}", expected "minted"` });
    }

    const report = await Reinspection.createReport(project.id, req.user.id, {
      gps_lat, gps_lng, photo_ipfs_cid, notes, reversal_detected, reversal_amount,
    });

    res.status(201).json({
      message: reversal_detected
        ? 'Re-inspection submitted. Reversal flagged — pending admin review before any buffer action is taken.'
        : 'Re-inspection submitted. No reversal detected.',
      report,
    });
  } catch (err) {
    console.error('Submit reinspection error:', err);
    res.status(500).json({ error: 'Failed to submit re-inspection report' });
  }
}

// GET /api/agent/projects/:id/reinspections — this agent's own re-inspection history for one project
async function getProjectReinspections(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    const reports = await Reinspection.findByProject(req.params.id);
    res.json({ reports });
  } catch (err) {
    console.error('Get project reinspections error:', err);
    res.status(500).json({ error: 'Failed to fetch re-inspection reports' });
  }
}

module.exports = { submitReinspection, getProjectReinspections };