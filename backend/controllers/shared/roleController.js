const User = require('../../models/User');
const Otp = require('../../models/Otp');
const { sendOtpEmail } = require('../../services/emailService');
const { generateToken } = require('../../utils/token');

const VALID_ROLE_TYPES = ['seller', 'buyer'];
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

// POST /api/role/request   body: { role_type, name, phone_number }
// Triggered when a logged-in user clicks "Add Project" (role_type: 'seller')
// or "Buy Credit" (role_type: 'buyer') and doesn't have that capability yet.
async function requestRoleUpgrade(req, res) {
  try {
    const { role_type, name, phone_number } = req.body;

    if (!VALID_ROLE_TYPES.includes(role_type)) {
      return res.status(400).json({ error: `role_type must be one of: ${VALID_ROLE_TYPES.join(', ')}` });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!phone_number || !PHONE_REGEX.test(phone_number)) {
      return res.status(400).json({ error: 'A valid phone_number is required' });
    }

    // Already has this capability — nothing to do
    const currentUser = await User.findById(req.user.id);
    if ((role_type === 'seller' && currentUser.is_seller) || (role_type === 'buyer' && currentUser.is_buyer)) {
      return res.status(400).json({ error: `You already have ${role_type} access` });
    }

    await User.startRoleRequest(req.user.id, { name: name.trim(), phone_number, role_type });

    const otpCode = await Otp.createOtp(req.user.id, 'role_upgrade');
    await sendOtpEmail(currentUser.email, otpCode);

    res.json({ message: `Verification code sent to your email to confirm ${role_type} access` });
  } catch (err) {
    console.error('Request role upgrade error:', err);
    res.status(500).json({ error: 'Failed to start role upgrade' });
  }
}

// POST /api/role/verify   body: { otp_code }
// Grants the capability that was requested in requestRoleUpgrade — the role
// itself comes from the server-stored pending_role_request, NOT from the
// client, so a request can't be spoofed into granting a different role.
async function verifyRoleUpgrade(req, res) {
  try {
    const { otp_code } = req.body;
    if (!otp_code) {
      return res.status(400).json({ error: 'otp_code is required' });
    }

    const validOtp = await Otp.findValidOtp(req.user.id, otp_code, 'role_upgrade');
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findById(req.user.id);
    if (!user.pending_role_request) {
      return res.status(400).json({ error: 'No role upgrade is currently pending' });
    }

    if (user.pending_role_request === 'seller') {
      await User.setSellerFlag(req.user.id);
    } else if (user.pending_role_request === 'buyer') {
      await User.setBuyerFlag(req.user.id);
    }

    await User.clearPendingRoleRequest(req.user.id);
    await Otp.deleteOtpsForUser(req.user.id, 'role_upgrade');

    const updatedUser = await User.findById(req.user.id);
    const token = generateToken(updatedUser);

    res.json({ message: 'Role upgrade verified', user: updatedUser, token });
  } catch (err) {
    console.error('Verify role upgrade error:', err);
    res.status(500).json({ error: 'Failed to verify role upgrade' });
  }
}

module.exports = { requestRoleUpgrade, verifyRoleUpgrade };


