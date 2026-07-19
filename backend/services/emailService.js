const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(toEmail, otpCode) {
  await transporter.sendMail({
    from: `"Carbon X Credit " <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email — OTP Code',
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>Verify your email</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="letter-spacing: 4px;">${otpCode}</h1>
        <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

async function sendAgentCredentialsEmail(toEmail, name, tempPassword) {
  await transporter.sendMail({
    from: `"Carbon Credit Platform" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Agent account has been created',
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>Welcome, ${name}</h2>
        <p>An administrator has created an Agent account for you on the Carbon Credit Platform.</p>
        <p><strong>Email:</strong> ${toEmail}</p>
        <p><strong>Temporary password:</strong> ${tempPassword}</p>
        <p>Please log in and change your password as soon as possible.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail, sendAgentCredentialsEmail };