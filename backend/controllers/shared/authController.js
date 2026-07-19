const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Otp = require('./models/Otp');
const { sendOtpEmail } = require('./services/emailService');

const SELF_SIGNUP_ROLES = ['seller', 'buyer'];

// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are required' });
    }
    if (!SELF_SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${SELF_SIGNUP_ROLES.join(', ')}` });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.createUser({ name, email, passwordHash, role }); // is_verified defaults to false

    const otpCode = await Otp.createOtp(user.id, 'signup');
    await sendOtpEmail(email, otpCode);

    // No token yet — account isn't usable until OTP is verified
    res.status(201).json({
      message: 'Account created. Check your email for a verification code.',
      userId: user.id,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

// POST /api/auth/verify-otp
async function verifyOtp(req, res) {
  try {
    const { userId, otpCode } = req.body;
    if (!userId || !otpCode) {
      return res.status(400).json({ error: 'userId and otpCode are required' });
    }

    const validOtp = await Otp.findValidOtp(userId, otpCode, 'signup');
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.markVerified(userId);
    await Otp.deleteOtpsForUser(userId, 'signup');

    const fullUser = await User.findById(userId);
    const token = generateToken(fullUser);

    res.json({ message: 'Email verified successfully', user: fullUser, token });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      // Same error for missing user vs wrong password — don't reveal which one
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Email not verified. Please verify your account first.' });
    }

    const token = generateToken(user);
    delete user.password_hash; // never send the hash back to the client
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
}

// GET /api/auth/me  (requires auth middleware — see middleware/auth.js)
async function getProfile(req, res) {
  const user = await User.findById(req.user.id);
  res.json({ user });
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { signup, verifyOtp, login, getProfile };


