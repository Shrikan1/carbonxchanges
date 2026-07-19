const { query } = require('../config/db');

async function updateWalletAddress(userId, walletAddress) {
  const result = await query(
    `UPDATE users SET wallet_address = $1, wallet_connected_at = NOW()
     WHERE id = $2
     RETURNING id, wallet_address, wallet_connected_at`,
    [walletAddress, userId]
  );
  return result.rows[0];
}

async function clearWalletAddress(userId) {
  const result = await query(
    `UPDATE users SET wallet_address = NULL, wallet_connected_at = NULL
     WHERE id = $1
     RETURNING id, wallet_address, wallet_connected_at`,
    [userId]
  );
  return result.rows[0];
}

async function findWallet(userId) {
  const result = await query(
    `SELECT id, wallet_address, wallet_connected_at FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

// Used by connectWallet to reject an address already linked to a different account
async function findUserByWalletAddress(walletAddress) {
  const result = await query(
    `SELECT id, name, email FROM users WHERE wallet_address = $1`,
    [walletAddress]
  );
  return result.rows[0] || null;
}

module.exports = { updateWalletAddress, clearWalletAddress, findWallet, findUserByWalletAddress };