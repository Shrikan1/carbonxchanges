const { query } = require('../config/db');

async function createCertificate(transactionId, burnTxHash, certificatePdfUrl, retirementReason, beneficiaryName) {
  const result = await query(
    `INSERT INTO retirement_certificates
       (transaction_id, burn_tx_hash, certificate_pdf_url, retirement_reason, beneficiary_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [transactionId, burnTxHash, certificatePdfUrl, retirementReason || null, beneficiaryName || null]
  );
  return result.rows[0];
}

// Full detail needed to both check ownership AND render the certificate PDF —
// buyer name, project title, amount, dates, tx hash, all in one query.
async function findCertificateDetails(certificateId) {
  const result = await query(
    `SELECT rc.*, t.buyer_id, t.amount, t.created_at AS retired_at,
            p.title AS project_title, p.project_type, cb.vintage_year, cb.id AS token_id,
            u.name AS buyer_name
     FROM retirement_certificates rc
     JOIN transactions t ON t.id = rc.transaction_id
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     JOIN users u ON u.id = t.buyer_id
     WHERE rc.id = $1`,
    [certificateId]
  );
  return result.rows[0] || null;
}

async function findByBuyer(buyerId) {
  const result = await query(
    `SELECT rc.*, t.amount, t.created_at AS retired_at, p.title AS project_title
     FROM retirement_certificates rc
     JOIN transactions t ON t.id = rc.transaction_id
     JOIN credit_batches cb ON cb.id = t.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE t.buyer_id = $1
     ORDER BY rc.issued_at DESC`,
    [buyerId]
  );
  return result.rows;
}

module.exports = { createCertificate, findCertificateDetails, findByBuyer };