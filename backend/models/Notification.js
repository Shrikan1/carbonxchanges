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

module.exports = { createNotification, findRecentByUser };