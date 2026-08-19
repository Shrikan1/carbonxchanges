const { query } = require('../config/db');


async function createNotification(userId, title, message) {
  const result = await query(
    `INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *`,
    [userId, title, message]
  );
  return result.rows[0];
}

async function findRecentByUser(userId, limit = 10) {
  const result = await query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function markAsRead(id, userId) {
  const result = await query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

async function getUnreadCount(userId) {
  const result = await query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}

module.exports = { createNotification, findRecentByUser, markAsRead, getUnreadCount };