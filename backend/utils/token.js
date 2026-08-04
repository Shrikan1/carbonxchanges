const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    // token_version lets us invalidate all existing tokens for a user
    // (e.g. after a role upgrade) without a token blacklist table.
    { id: user.id, email: user.email, role: user.role, tv: user.token_version ?? 0 },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Short-lived access token (15 min). Used by the refresh endpoint so the
// long-lived refresh cookie doesn't need to travel on every API call.
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, tv: user.token_version ?? 0 },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, generateRefreshToken, verifyToken };