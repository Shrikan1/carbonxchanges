const rateLimit = require('express-rate-limit')

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:5,
   message: { error: 'Too many OTP requests. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false, 
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                   // 50 attempts per window (was 5/5min — far too tight for dev)
    message: { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
    standardHeaders: true,
    legacyHeaders: false,
})


const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max:200,
    message:{error:'Server is Busy. Try again later..'}
})

// Protects all write operations (create listing, create agent, upload docs, submit reports)
// 20 write actions per minute is generous for real use but blocks automated abuse
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Slow down and try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Financial operations — tighter: 5 purchases per minute per IP
const purchaseLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many purchase attempts. Try again shortly.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Credential changes — same window/limit as OTP to stay consistent
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many password change attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpLimiter, loginLimiter, generalLimiter, writeLimiter, purchaseLimiter, passwordLimiter };