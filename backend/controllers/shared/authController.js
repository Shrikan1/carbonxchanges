const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const { sendOtpEmail } = require('../../services/emailService');
const { generateToken, generateRefreshToken, verifyToken } = require('../../utils/token');



// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // No role passed — every account starts as base 'user' with no seller/buyer capability
    const user = await User.createUser({ name, email, passwordHash });

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
y
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
    const refreshToken = generateRefreshToken(user);
    delete user.password_hash; // never send the hash back to the client

    // Refresh token travels as an httpOnly cookie — never accessible to JS,
    // so it can't be stolen via XSS. Access token goes in the response body
    // for the frontend to store in memory (not localStorage).
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      })
      .json({ user, token });

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

// POST /api/auth/refresh
// Issues a new access token from the httpOnly refresh cookie set at login.
// This lets the frontend silently re-authenticate when the short-lived access
// token expires, without forcing the user to re-enter their password.
async function refreshToken(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Revocation check — same as middleware/auth.js
  if ((user.token_version ?? 0) !== (decoded.tv ?? 0)) {
    return res.status(401).json({ error: 'Refresh token has been revoked. Please log in again.' });
  }

  const newAccessToken = generateToken(user);
  res.json({ token: newAccessToken });
}

// POST /api/auth/logout
// Bumps token_version so ALL existing tokens (access + refresh) for this user
// are immediately revoked, then clears the refresh cookie.
async function logout(req, res) {
  if (req.user?.id) {
    await User.bumpTokenVersion(req.user.id);
  }
  res
    .clearCookie('refreshToken')
    .json({ message: 'Logged out successfully' });
}

module.exports = { signup, verifyOtp, login, getProfile, refreshToken, logout };



