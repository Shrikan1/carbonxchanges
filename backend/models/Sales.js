const { query } = require('../config/db');


async function findSalesHistory(sellerId) {
  const result = await query(
    `SELECT t.id, t.tx_hash, t.amount, t.price_per_credit, t.total_price, t.created_at,
            p.title AS project_title, u.name AS buyer_name, u.email AS buyer_email
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN users u ON u.id = t.buyer_id
     WHERE t.seller_id = $1 AND t.type = 'purchase'
     ORDER BY t.created_at DESC`,
    [sellerId]
  );
  return result.rows;
}


async function calculateRevenue(sellerId) {
  const totalResult = await query(
    `SELECT
       COALESCE(SUM(total_price), 0) AS total_revenue,
       COALESCE(SUM(amount), 0) AS total_credits_sold,
       COUNT(*) AS total_sales
     FROM transactions
     WHERE seller_id = $1 AND type = 'purchase'`,
    [sellerId]
  );

  const byProjectResult = await query(
    `SELECT p.id AS project_id, p.title AS project_title,
            COALESCE(SUM(t.total_price), 0) AS revenue,
            COALESCE(SUM(t.amount), 0) AS credits_sold
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE t.seller_id = $1 AND t.type = 'purchase'
     GROUP BY p.id, p.title
     ORDER BY revenue DESC`,
    [sellerId]
  );

  return {
    total_revenue: Number(totalResult.rows[0].total_revenue),
    total_credits_sold: Number(totalResult.rows[0].total_credits_sold),
    total_sales: Number(totalResult.rows[0].total_sales),
    by_project: byProjectResult.rows,
  };
}

module.exports = { findSalesHistory, calculateRevenue };