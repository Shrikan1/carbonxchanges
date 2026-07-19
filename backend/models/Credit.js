const { query } = require('../config/db');

// All credit batches minted for a single project
async function findCreditsByProject(projectId) {
  const result = await query(
    `SELECT * FROM credit_batches WHERE project_id = $1 ORDER BY minted_at DESC`,
    [projectId]
  );
  return result.rows;
}

// All credit batches across every project this seller owns — used for
// the seller's "Issued Credits" list, joined with project title for display.
async function findCreditsBySeller(sellerId) {
  const result = await query(
    `SELECT cb.*, p.title AS project_title
     FROM credit_batches cb
     JOIN projects p ON p.id = cb.project_id
     WHERE p.seller_id = $1
     ORDER BY cb.minted_at DESC`,
    [sellerId]
  );
  return result.rows;
}

// Every transaction (purchase or retirement) tied to this seller's batches
async function findCreditTransactions(sellerId) {
  const result = await query(
    `SELECT t.*, p.title AS project_title, u.name AS buyer_name
     FROM transactions t
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN users u ON u.id = t.buyer_id
     WHERE p.seller_id = $1
     ORDER BY t.created_at DESC`,
    [sellerId]
  );
  return result.rows;
}

// Off-chain approximation of the seller's remaining (unsold) credit balance:
// total minted minus total sold. This is a convenience number for the
// dashboard — the real, authoritative balance always lives on-chain via
// the wallet's ERC-20 balanceOf(), fetched separately through ethers.js.
async function calculateSellerBalance(sellerId) {
  const result = await query(
    `SELECT
       COALESCE(SUM(cb.token_amount), 0) AS total_minted,
       COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'purchase'), 0) AS total_sold
     FROM credit_batches cb
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN transactions t ON t.batch_id = cb.id
     WHERE p.seller_id = $1`,
    [sellerId]
  );
  const row = result.rows[0];
  const totalMinted = Number(row.total_minted);
  const totalSold = Number(row.total_sold);
  return {
    total_minted: totalMinted,
    total_sold: totalSold,
    remaining_balance: totalMinted - totalSold,
  };
}

// Records a newly minted batch. Called right after blockchainService.mintTokens()
// succeeds — this is the off-chain mirror of that on-chain event.
async function createCreditBatch(projectId, tokenAmount, contractAddress, mintTxHash) {
  const result = await query(
    `INSERT INTO credit_batches (project_id, token_amount, contract_address, mint_tx_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [projectId, tokenAmount, contractAddress, mintTxHash]
  );
  return result.rows[0];
}

module.exports = {
  findCreditsByProject, findCreditsBySeller, findCreditTransactions, calculateSellerBalance,
  createCreditBatch,
};