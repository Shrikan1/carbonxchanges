// backend/models/ContactMessage.js
const { query } = require('../config/db');

// Ensure table exists on startup
async function initContactTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error('Failed to init contact_messages table:', err.message);
  }
}

initContactTable();

async function createContactMessage({ name, email, phone, message }) {
  const result = await query(
    `INSERT INTO contact_messages (name, email, phone, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, phone || null, message]
  );
  return result.rows[0];
}

async function getAllContactMessages({ status, limit = 100, offset = 0 } = {}) {
  let queryText = 'SELECT * FROM contact_messages';
  const params = [];

  if (status && status !== 'all') {
    params.push(status);
    queryText += ` WHERE status = $${params.length}`;
  }

  queryText += ' ORDER BY created_at DESC';

  params.push(limit, offset);
  queryText += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await query(queryText, params);

  // Count summaries
  const countRes = await query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(CASE WHEN status = 'unread' THEN 1 END) AS unread,
      COUNT(CASE WHEN status = 'read' THEN 1 END) AS read,
      COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved
    FROM contact_messages
  `);

  const counts = countRes.rows[0] || { total: 0, unread: 0, read: 0, resolved: 0 };

  return {
    rows: result.rows,
    total: parseInt(counts.total, 10),
    unread: parseInt(counts.unread, 10),
    read: parseInt(counts.read, 10),
    resolved: parseInt(counts.resolved, 10),
  };
}

async function updateMessageStatus(id, status) {
  const result = await query(
    `UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

async function deleteContactMessage(id) {
  const result = await query(
    `DELETE FROM contact_messages WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
};
