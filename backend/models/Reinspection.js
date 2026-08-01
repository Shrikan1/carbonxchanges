const { query } = require('../config/db');

async function createReport(projectId, agentId, data) {
  const result = await query(
    `INSERT INTO reinspection_reports
       (project_id, agent_id, gps_lat, gps_lng, photo_ipfs_cid, notes, reversal_detected, reversal_amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      projectId, agentId, data.gps_lat, data.gps_lng, data.photo_ipfs_cid, data.notes || null,
      !!data.reversal_detected, data.reversal_detected ? data.reversal_amount : null,
    ]
  );
  return result.rows[0];
}

async function findByProject(projectId) {
  const result = await query(
    `SELECT * FROM reinspection_reports WHERE project_id = $1 ORDER BY submitted_at DESC`,
    [projectId]
  );
  return result.rows;
}

async function findById(reportId) {
  const result = await query(`SELECT * FROM reinspection_reports WHERE id = $1`, [reportId]);
  return result.rows[0] || null;
}

// Reversal findings admin hasn't acted on yet — the queue for Section
// "reversal handling"
async function findUnresolvedReversals() {
  const result = await query(
    `SELECT rr.*, p.title AS project_title
     FROM reinspection_reports rr
     JOIN projects p ON p.id = rr.project_id
     WHERE rr.reversal_detected = true AND rr.resolved = false
     ORDER BY rr.submitted_at ASC`
  );
  return result.rows;
}

async function markResolved(reportId) {
  const result = await query(
    `UPDATE reinspection_reports SET resolved = true, resolved_at = NOW() WHERE id = $1 RETURNING *`,
    [reportId]
  );
  return result.rows[0];
}

module.exports = { createReport, findByProject, findById, findUnresolvedReversals, markResolved };