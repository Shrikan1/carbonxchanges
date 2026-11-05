const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const { sendOtpEmail } = require('../../services/emailService');
const { generateToken, generateRefreshToken, verifyToken } = require('../../utils/token');
const { getRefreshCookieOptions } = require('../../utils/cookieOptions');



// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword, role_type, phone_number, address } = req.body;

    if (!name || !email || !password || !confirmPassword || !phone_number || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate role_type if provided
    const VALID_ROLES = ['seller', 'buyer'];
    if (role_type && !VALID_ROLES.includes(role_type)) {
      return res.status(400).json({ error: `role_type must be 'seller' or 'buyer'` });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Every account starts as base 'user'. If role_type was provided at signup,
    // we record it in pending_role_request to upgrade them after OTP verify.
    const user = await User.createUser({ name, email, passwordHash, phone_number, address });
    if (role_type === 'seller') await User.setSellerFlag(user.id);
    else if (role_type === 'buyer') await User.setBuyerFlag(user.id);

    const otpCode = await Otp.createOtp(user.id, 'signup');
    
    // Send email asynchronously (non-blocking) to improve response time
    // Email failures won't block signup - user can request resend if needed
    sendOtpEmail(email, otpCode)
      .then(() => console.log(`✅ OTP email sent to ${email}`))
      .catch((error) => console.error(`❌ Failed to send OTP email to ${email}:`, error.message));

    // Respond immediately without waiting for email
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

// POST /api/auth/resend-otp
async function resendOtp(req, res) {
  try {
    const { userId, purpose = 'signup' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified && purpose === 'signup') {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new OTP
    const otpCode = await Otp.createOtp(userId, purpose);
    
    // Send email asynchronously
    if (purpose === 'signup') {
      sendOtpEmail(user.email, otpCode)
        .then(() => console.log(`✅ OTP resent to ${user.email}`))
        .catch((error) => console.error(`❌ Failed to resend OTP to ${user.email}:`, error.message));
    } else if (purpose === 'reset_password') {
      const { sendPasswordResetEmail } = require('../../services/emailService');
      sendPasswordResetEmail(user.email, otpCode)
        .then(() => console.log(`✅ Password reset OTP resent to ${user.email}`))
        .catch((error) => console.error(`❌ Failed to resend password reset OTP:`, error.message));
    }

    res.json({ 
      message: 'A new verification code has been sent to your email',
      userId: user.id 
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Failed to resend OTP' });
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
      .cookie('refreshToken', refreshToken, getRefreshCookieOptions(req))
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
  const newRefreshToken = generateRefreshToken(user);

  res
    .cookie('refreshToken', newRefreshToken, getRefreshCookieOptions(req))
    .json({ token: newAccessToken, user });
}

// POST /api/auth/logout
// Bumps token_version so ALL existing tokens (access + refresh) for this user
// are immediately revoked, then clears the refresh cookie.
async function logout(req, res) {
  if (req.user?.id) {
    await User.bumpTokenVersion(req.user.id);
  }
  const cookieOpts = getRefreshCookieOptions(req);
  delete cookieOpts.maxAge;
  res
    .clearCookie('refreshToken', cookieOpts)
    .json({ message: 'Logged out successfully' });
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't leak whether the email exists. Just return success.
      return res.json({ message: 'If that email is in our system, we have sent a reset code.' });
    }

    const otpCode = await Otp.createOtp(user.id, 'reset_password');
    // Important: we need to import sendPasswordResetEmail at the top!
    const { sendPasswordResetEmail } = require('../../services/emailService');
    await sendPasswordResetEmail(email, otpCode);

    res.json({ message: 'If that email is in our system, we have sent a reset code.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res) {
  try {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const validOtp = await Otp.findValidOtp(user.id, otpCode, 'reset_password');
    if (!validOtp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, passwordHash);
    await User.bumpTokenVersion(user.id); // Revoke existing sessions
    await Otp.deleteOtpsForUser(user.id, 'reset_password');

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}

module.exports = { signup, verifyOtp, resendOtp, login, getProfile, refreshToken, logout, forgotPassword, resetPassword };



