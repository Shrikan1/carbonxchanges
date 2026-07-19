const { query } = require('../config/db');

// Optional filters: role ('user'/'agent'/'admin'), is_seller, is_buyer (booleans)
async function findAllUsers({ role, is_seller, is_buyer } = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  if (role) { conditions.push(`role = $${i++}`); values.push(role); }
  if (is_seller !== undefined) { conditions.push(`is_seller = $${i++}`); values.push(is_seller); }
  if (is_buyer !== undefined) { conditions.push(`is_buyer = $${i++}`); values.push(is_buyer); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT id, name, email, role, is_seller, is_buyer, phone_number, wallet_address, created_at
     FROM users ${whereClause}
     ORDER BY created_at DESC`,
    values
  );
  return result.rows;
}

// Optional status filter. Includes expected_completion_date and agent name
// so admin can see, at a glance, which in_progress projects are overdue.
async function findAllProjects(status) {
  const result = await query(
    `SELECT p.id, p.title, p.project_type, p.project_scale, p.status,
            p.expected_completion_date, p.created_at,
            u.name AS seller_name, u.email AS seller_email,
            a.name AS agent_name
     FROM projects p
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN users a ON a.id = p.agent_id
     ${status ? 'WHERE p.status = $1' : ''}
     ORDER BY p.created_at DESC`,
    status ? [status] : []
  );
  return result.rows;
}

// Every transaction platform-wide (both 'purchase' and 'retire' types)
async function findAllTransactions() {
  const result = await query(
    `SELECT t.*, p.title AS project_title, s.name AS seller_name, b.name AS buyer_name
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN users s ON s.id = t.seller_id
     LEFT JOIN users b ON b.id = t.buyer_id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
}

module.exports = { findAllUsers, findAllProjects, findAllTransactions };