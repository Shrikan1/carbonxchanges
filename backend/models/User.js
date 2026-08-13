// Models hold raw SQL only — no business logic, no request/response handling.
// Controllers call these functions and decide what to do with the result.

const { query } = require('../config/db');

async function createUser({ name, email, passwordHash }) {
  // No role passed in — every self-signup starts as the base 'user' role
  // (DB default) with is_seller/is_buyer both false.
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, is_seller, is_buyer, created_at`,
    [name, email, passwordHash]
  );
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await query(
    'SELECT id, name, email, role, is_seller, is_buyer, wallet_address, token_version, pending_role_request, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// Called at the START of a role upgrade (before OTP is verified) — updates
// name/phone_number immediately (not sensitive, safe either way) and marks
// which role is pending. The actual is_seller/is_buyer flag is NOT set here.
async function startRoleRequest(userId, { name, phone_number, role_type }) {
  const result = await query(
    `UPDATE users SET name = $1, phone_number = $2, pending_role_request = $3
     WHERE id = $4
     RETURNING id, name, email, phone_number, pending_role_request`,
    [name, phone_number, role_type, userId]
  );
  return result.rows[0];
}

async function clearPendingRoleRequest(userId) {
  await query('UPDATE users SET pending_role_request = NULL WHERE id = $1', [userId]);
}

// Marks a user's email as verified after a successful OTP check
async function markVerified(userId) {
  const result = await query(
    'UPDATE users SET is_verified = true WHERE id = $1 RETURNING id, email, is_verified',
    [userId]
  );
  return result.rows[0];
}

// Admin-only path: creates an agent account directly, already verified,
// and records which admin created it via created_by.
async function createAgent({ name, email, passwordHash, createdByAdminId }) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, is_verified, created_by)
     VALUES ($1, $2, $3, 'agent', true, $4)
     RETURNING id, name, email, role, is_verified, created_at`,
    [name, email, passwordHash, createdByAdminId]
  );
  return result.rows[0];
}

// Grants seller capability — called the first time a user hits a
// seller-only action (e.g. "Add Project"). Idempotent: safe to call
// even if already true.
async function setSellerFlag(userId) {
  const result = await query(
    'UPDATE users SET is_seller = true WHERE id = $1 RETURNING id, is_seller',
    [userId]
  );
  return result.rows[0];
}

// Same idea, for buyer capability (e.g. "Buy Credit").
async function setBuyerFlag(userId) {
  const result = await query(
    'UPDATE users SET is_buyer = true WHERE id = $1 RETURNING id, is_buyer',
    [userId]
  );
  return result.rows[0];
}

// Updates editable profile fields. Email is intentionally NOT editable here —
// changing it would require re-running OTP verification, which is a bigger
// flow than a simple profile edit; keep that as a separate feature if needed later.
async function updateProfile(userId, { name }) {
  const result = await query(
    `UPDATE users SET name = $1 WHERE id = $2
     RETURNING id, name, email, role, is_seller, is_buyer, wallet_address, created_at`,
    [name, userId]
  );
  return result.rows[0];
}

async function updatePassword(userId, newPasswordHash) {
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
}

// Increments token_version, immediately invalidating ALL previously issued
// JWTs for this user — the middleware checks tv === token_version on each
// request. Call this after a role upgrade or password change so stale tokens
// can no longer be used even if they haven't expired yet.
async function bumpTokenVersion(userId) {
  const result = await query(
    'UPDATE users SET token_version = token_version + 1 WHERE id = $1 RETURNING token_version',
    [userId]
  );
  return result.rows[0].token_version;
}

// Includes password_hash — used ONLY internally (e.g. changePassword's
// current-password check), never sent back in an API response.
async function findByIdWithPassword(userId) {
  const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0];
}

// Used by assignAgent — confirms the id actually belongs to an agent
// (not just any user id), so an admin can't accidentally assign a buyer.
async function findAgentById(agentId) {
  const result = await query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1 AND role = 'agent'`,
    [agentId]
  );
  return result.rows[0] || null;
}

// Full agent roster — used by the admin UI's agent picker/workload view
async function findAllAgents({ limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT id, name, email, created_at FROM users WHERE role = 'agent' ORDER BY name ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    query(`SELECT COUNT(*) FROM users WHERE role = 'agent'`),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

module.exports = {
  createUser, findByEmail, findById, markVerified, createAgent,
  setSellerFlag, setBuyerFlag, updateProfile, updatePassword, findByIdWithPassword,
  findAgentById, findAllAgents, startRoleRequest, clearPendingRoleRequest, bumpTokenVersion,
};