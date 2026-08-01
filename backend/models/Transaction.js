const { query } = require('../config/db');

async function createPurchaseTransaction(batchId, buyerId, sellerId, txHash, amount, pricePerCredit) {
  const totalPrice = Math.round(Number(amount) * Number(pricePerCredit) * 100) / 100;
  const result = await query(
    `INSERT INTO transactions (batch_id, buyer_id, seller_id, tx_hash, type, amount, price_per_credit, total_price)
     VALUES ($1, $2, $3, $4, 'purchase', $5, $6, $7)
     RETURNING *`,
    [batchId, buyerId, sellerId, txHash, amount, pricePerCredit, totalPrice]
  );
  return result.rows[0];
}

async function findById(transactionId) {
  const result = await query(`SELECT * FROM transactions WHERE id = $1`, [transactionId]);
  return result.rows[0] || null;
}

// Retirement isn't a sale — no seller_id, no price. Just a permanent record
// of a buyer destroying credits they held.
async function createRetireTransaction(batchId, buyerId, txHash, amount) {
  const result = await query(
    `INSERT INTO transactions (batch_id, buyer_id, seller_id, tx_hash, type, amount, price_per_credit, total_price)
     VALUES ($1, $2, NULL, $3, 'retire', $4, NULL, NULL)
     RETURNING *`,
    [batchId, buyerId, txHash, amount]
  );
  return result.rows[0];
}

// Every transaction (both 'purchase' and 'retire') for one buyer, most
// recent first — includes vintage_year and project info since a buyer's
// history should always show which specific batch each transaction touched.
async function findByBuyer(buyerId) {
  const result = await query(
    `SELECT t.*, p.title AS project_title, p.project_type, cb.vintage_year
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE t.buyer_id = $1
     ORDER BY t.created_at DESC`,
    [buyerId]
  );
  return result.rows;
}

module.exports = { createPurchaseTransaction, createRetireTransaction, findById, findByBuyer };