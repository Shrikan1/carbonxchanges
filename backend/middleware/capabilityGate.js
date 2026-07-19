function ensureCapability(flagName, roleType) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user[flagName]) {
      return next();
    }

    
    return res.status(403).json({
      error: `${roleType} access required`,
      code: 'ROLE_VERIFICATION_REQUIRED',
      role_required: roleType,
    });
  };
}

const ensureSeller = ensureCapability('is_seller', 'seller');
const ensureBuyer = ensureCapability('is_buyer', 'buyer');

module.exports = { ensureSeller, ensureBuyer };
