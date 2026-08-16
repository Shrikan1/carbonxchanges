const { query } = require('../config/db');

// Returns the project's status plus BOTH verification reports if they
// exist (initial and completion are separate rows now, not one "latest").
// Most projects will have zero, one, or two reports total — never more,
// since each type can only be submitted once per project (enforced in
// the controller by checking project.status before allowing a submission).
async function getVerificationStatus(projectId) {
  const projectResult = await query(
    `SELECT id, status, agent_id, expected_completion_date FROM projects WHERE id = $1`,
    [projectId]
  );
  const project = projectResult.rows[0];
  if (!project) return null;

  const reportsResult = await query(
    `SELECT * FROM verification_reports WHERE project_id = $1 ORDER BY submitted_at ASC`,
    [projectId]
  );
  const reports = reportsResult.rows;

  return {
    project_id: project.id,
    status: project.status,
    agent_id: project.agent_id,
    expected_completion_date: project.expected_completion_date,
    initial_report: reports.find((r) => r.report_type === 'initial') || null,
    completion_report: reports.find((r) => r.report_type === 'completion') || null,
  };
}

// Basic public-safe info about the agent assigned to a project (no password hash etc.)
async function findAssignedAgent(projectId) {
  const result = await query(
    `SELECT u.id, u.name, u.email
     FROM projects p
     JOIN users u ON u.id = p.agent_id
     WHERE p.id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

// Seller replies to the agent's findings on a specific verification report
async function updateSellerResponse(reportId, responseText) {
  const result = await query(
    `UPDATE verification_reports
     SET seller_response = $1, seller_response_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [responseText, reportId]
  );
  return result.rows[0];
}

// Needed by the controller to verify a report belongs to the seller's project
// before letting them respond to it.
async function findReportById(reportId) {
  const result = await query(
    `SELECT vr.*, p.seller_id
     FROM verification_reports vr
     JOIN projects p ON p.id = vr.project_id
     WHERE vr.id = $1`,
    [reportId]
  );
  return result.rows[0] || null;
}

// Agent's field submission. report_type is 'initial' or 'completion'.
// verified_co2_amount should only ever be non-null when report_type is
// 'completion' — enforced by the controller, not here (this model stays a
// pure data layer), but documented clearly since it's the critical rule.
// photo_url is now a Supabase Storage URL (uploaded via /api/upload/kyc)
// rather than an IPFS CID — agent photos are private until the final
// verification PDF is generated and pinned to IPFS.
async function createVerificationReport(projectId, agentId, reportType, data) {
  const result = await query(
    `INSERT INTO verification_reports
       (project_id, agent_id, report_type, gps_lat, gps_lng, photo_url, notes, verified_co2_amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      projectId, agentId, reportType,
      data.gps_lat, data.gps_lng, data.photo_url, data.notes || null,
      data.verified_co2_amount || null,
    ]
  );
  return result.rows[0];
}

// The single figure minting actually depends on — always the most recent
// 'completion' report for a project (there should only ever be one, but
// ORDER BY + LIMIT 1 protects against any future re-verification scenario).
async function findLatestCompletionReport(projectId) {
  const result = await query(
    `SELECT * FROM verification_reports
     WHERE project_id = $1 AND report_type = 'completion'
     ORDER BY submitted_at DESC LIMIT 1`,
    [projectId]
  );
  return result.rows[0] || null;
}

// Every report this agent has ever submitted, most recent first — their
// personal "Verification History" (as opposed to getAssignedProjects,
// which is the active queue of projects still needing action).
async function findReportsByAgent(agentId) {
  const result = await query(
    `SELECT vr.*, p.title AS project_title, p.status AS project_status
     FROM verification_reports vr
     JOIN projects p ON p.id = vr.project_id
     WHERE vr.agent_id = $1
     ORDER BY vr.submitted_at DESC`,
    [agentId]
  );
  return result.rows;
}

module.exports = {
  getVerificationStatus, findAssignedAgent, updateSellerResponse, findReportById,
  createVerificationReport, findLatestCompletionReport, findReportsByAgent,
};