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

module.exports = { createDocument, findDocumentsByProject };