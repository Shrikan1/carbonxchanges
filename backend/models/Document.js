const { query } = require('../config/db');

async function createDocument(projectId, docType, ipfsCid) {
  const result = await query(
    `INSERT INTO documents (project_id, doc_type, ipfs_cid) VALUES ($1, $2, $3) RETURNING *`,
    [projectId, docType, ipfsCid]
  );
  return result.rows[0];
}

async function findDocumentsByProject(projectId) {
  const result = await query(
    `SELECT * FROM documents WHERE project_id = $1 ORDER BY uploaded_at DESC`,
    [projectId]
  );
  return result.rows;
}

async function updateDocumentStatus(docId, status, rejectionReason = null) {
  const result = await query(
    `UPDATE documents SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
    [status, rejectionReason, docId]
  );
  return result.rows[0];
}

async function deleteDocument(docId) {
  await query(`DELETE FROM documents WHERE id = $1`, [docId]);
}

module.exports = { createDocument, findDocumentsByProject, updateDocumentStatus, deleteDocument };