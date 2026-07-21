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

module.exports = { createPurchaseTransaction, findById };