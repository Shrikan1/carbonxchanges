const { query } = require('../config/db');

async function createMessage(reportId, senderId, message) {
  const result = await query(
    `INSERT INTO verification_messages (report_id, sender_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [reportId, senderId, message]
  );
  return result.rows[0];
}

// Includes sender name so the UI can render "Jane: ..." directly. Deliberately
// does NOT return u.role to label the sender as "Agent"/"Seller" — role no
// longer reliably means that after the is_seller/is_buyer redesign (role is
// 'user' for most people now). The frontend should instead compare
// sender_id against the report's agent_id / the project's seller_id, both
// of which it already has.
async function findByReport(reportId) {
  const result = await query(
    `SELECT vm.*, u.name AS sender_name
     FROM verification_messages vm
     JOIN users u ON u.id = vm.sender_id
     WHERE vm.report_id = $1
     ORDER BY vm.created_at ASC`,
    [reportId]
  );
  return result.rows;
}

module.exports = { createMessage, findByReport };