const { query } = require('../config/db');

// Current holding per project = total purchased minus total retired.
// HAVING > 0 excludes projects the buyer has fully retired out of — those
// show up in transaction history, but not as a current holding.
async function findPortfolioByBuyer(buyerId) {
  const result = await query(
    `SELECT p.id AS project_id, p.title AS project_title, p.project_type,
            cb.id AS batch_id,
            COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'purchase'), 0) AS total_purchased,
            COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'retire'), 0) AS total_retired,
            (COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'purchase'), 0)
             - COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'retire'), 0)) AS current_holding
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE t.buyer_id = $1
     GROUP BY p.id, p.title, p.project_type, cb.id
     HAVING (COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'purchase'), 0)
             - COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'retire'), 0)) > 0
     ORDER BY p.title ASC`,
    [buyerId]
  );
  return result.rows;
}

// Platform-wide totals across every project — the summary card at the top of the portfolio page
async function getPortfolioSummary(buyerId) {
  const result = await query(
    `SELECT
       COALESCE(SUM(amount) FILTER (WHERE type = 'purchase'), 0) AS total_purchased,
       COALESCE(SUM(amount) FILTER (WHERE type = 'retire'), 0) AS total_retired
     FROM transactions
     WHERE buyer_id = $1`,
    [buyerId]
  );
  const row = result.rows[0];
  const totalPurchased = Number(row.total_purchased);
  const totalRetired = Number(row.total_retired);
  return {
    total_purchased: totalPurchased,
    total_retired: totalRetired,
    current_holdings: totalPurchased - totalRetired,
  };
}

module.exports = { findPortfolioByBuyer, getPortfolioSummary };