const { query } = require('../config/db');

async function createIssue({ project_id, agent_id, category, description }) {
  const result = await query(
    `INSERT INTO project_issues (project_id, agent_id, category, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [project_id, agent_id, category, description]
  );
  return result.rows[0];
}

async function findIssuesByProject(project_id) {
  const result = await query(
    `SELECT i.*, u.name AS agent_name
     FROM project_issues i
     LEFT JOIN users u ON i.agent_id = u.id
     WHERE i.project_id = $1
     ORDER BY i.created_at DESC`,
    [project_id]
  );
  return result.rows;
}

module.exports = {
  createIssue,
  findIssuesByProject
};
