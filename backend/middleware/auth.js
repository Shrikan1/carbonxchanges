const { verifyToken } = require('../utils/token');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check token_version: if the user's DB version is higher than what's in
  // the token (tv), the token was issued before a role upgrade or password
  // change and must be treated as revoked — even if it hasn't expired yet.
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if ((user.token_version ?? 0) !== (decoded.tv ?? 0)) {
    return res.status(401).json({ error: 'Token has been revoked. Please log in again.' });
  }

  req.user = decoded;
  next();
}

module.exports = { requireAuth };
