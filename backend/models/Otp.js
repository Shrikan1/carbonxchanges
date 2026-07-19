const { query } = require('../config/db');

const OTP_EXPIRY_MINUTES = 10;

// Generates a random 6-digit code as a string (e.g. "042817")
function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createOtp(userId, purpose = 'signup') {
  const otpCode = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await query('DELETE FROM otps WHERE user_id = $1 AND purpose = $2', [userId, purpose]);

  await query(
    `INSERT INTO otps (user_id, otp_code, purpose, expires_at) VALUES ($1, $2, $3, $4)`,
    [userId, otpCode, purpose, expiresAt]
  );

  return otpCode;
}

async function findValidOtp(userId, otpCode, purpose = 'signup') {
  const result = await query(
    `SELECT * FROM otps
     WHERE user_id = $1 AND otp_code = $2 AND purpose = $3 AND expires_at > NOW()`,
    [userId, otpCode, purpose]
  );
  return result.rows[0] || null;
}

async function deleteOtpsForUser(userId, purpose = 'signup') {
  await query('DELETE FROM otps WHERE user_id = $1 AND purpose = $2', [userId, purpose]);
}

module.exports = { createOtp, findValidOtp, deleteOtpsForUser };