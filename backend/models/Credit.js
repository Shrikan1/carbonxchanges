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
async function findCreditsBySeller(sellerId, { limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT cb.*, p.title AS project_title
       FROM credit_batches cb
       JOIN projects p ON p.id = cb.project_id
       WHERE p.seller_id = $1 AND cb.contract_address IS NOT NULL
       ORDER BY cb.minted_at DESC LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset]
    ),
    query(
      `SELECT COUNT(*) FROM credit_batches cb JOIN projects p ON p.id = cb.project_id WHERE p.seller_id = $1 AND cb.contract_address IS NOT NULL`,
      [sellerId]
    ),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

// Every transaction (purchase or retirement) tied to this seller's batches
async function findCreditTransactions(sellerId, { limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT t.*, p.title AS project_title, u.name AS buyer_name
       FROM transactions t
       JOIN credit_batches cb ON cb.id = t.batch_id
       JOIN projects p ON p.id = cb.project_id
       LEFT JOIN users u ON u.id = t.buyer_id
       WHERE p.seller_id = $1
       ORDER BY t.created_at DESC LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset]
    ),
    query(
      `SELECT COUNT(*) FROM transactions t
       JOIN credit_batches cb ON cb.id = t.batch_id
       JOIN projects p ON p.id = cb.project_id
       WHERE p.seller_id = $1`,
      [sellerId]
    ),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

// Off-chain approximation of the seller's remaining (unsold) credit balance:
// total minted minus total sold. This is a convenience number for the
// dashboard — the real, authoritative balance always lives on-chain via
// the wallet's ERC-20 balanceOf(), fetched separately through ethers.js.
async function calculateSellerBalance(sellerId) {
  const [mintedResult, soldResult] = await Promise.all([
    query(
      `SELECT COALESCE(SUM(cb.token_amount), 0) AS total_minted
       FROM credit_batches cb
       JOIN projects p ON p.id = cb.project_id
       WHERE p.seller_id = $1 AND cb.contract_address IS NOT NULL`,
      [sellerId]
    ),
    query(
      `SELECT COALESCE(SUM(t.amount), 0) AS total_sold
       FROM transactions t
       JOIN credit_batches cb ON cb.id = t.batch_id
       JOIN projects p ON p.id = cb.project_id
       WHERE p.seller_id = $1 AND t.type = 'purchase'`,
      [sellerId]
    )
  ]);

  const totalMinted = Number(mintedResult.rows[0].total_minted);
  const totalSold = Number(soldResult.rows[0].total_sold);
  
  return {
    total_minted: totalMinted,
    total_sold: totalSold,
    remaining_balance: totalMinted - totalSold,
  };
}

// Step 1 of minting: inserts the batch row FIRST, before any on-chain call,
// specifically so its auto-generated `id` can be used as the ERC-1155
// tokenId passed to the actual mint transaction. contract_address/
// mint_tx_hash are left null here.
async function createPendingBatch(projectId, tokenAmount, vintageYear) {
  const result = await query(
    `INSERT INTO credit_batches (project_id, token_amount, vintage_year)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [projectId, tokenAmount, vintageYear]
  );
  return result.rows[0];
}

// Step 2: called after blockchainService.mintTokens() returns, filling in
// the actual on-chain result now that the transaction has confirmed.
async function finalizeCreditBatch(batchId, contractAddress, mintTxHash) {
  const result = await query(
    `UPDATE credit_batches SET contract_address = $1, mint_tx_hash = $2 WHERE id = $3 RETURNING *`,
    [contractAddress, mintTxHash, batchId]
  );
  return result.rows[0];
}

module.exports = {
  findCreditsByProject, findCreditsBySeller, findCreditTransactions, calculateSellerBalance,
  createPendingBatch, finalizeCreditBatch,
};