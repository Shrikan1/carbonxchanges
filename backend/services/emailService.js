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
      <div style="background-color: #0c0c0c; margin: 0; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 30px 20px;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">CARBON<span style="color: #bef264;">X</span>PLANET</span>
              </div>
              
              <!-- Header -->
              <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 600; color: #ffffff; text-align: center;">Verify your email</h2>
              
              <!-- Body -->
              <p style="margin: 0 0 25px; font-size: 15px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                Welcome to the next generation of decentralized climate action. Please use the verification code below to securely access your account.
              </p>
              
              <!-- OTP Card -->
              <div style="background-color: #050505; border: 1px solid #333333; border-radius: 8px; padding: 24px 20px; text-align: center; margin-bottom: 25px;">
                <h1 style="margin: 0; font-size: 38px; font-weight: 700; letter-spacing: 8px; color: #bef264; font-family: monospace;">${otpCode}</h1>
              </div>
              
              <!-- Expiry -->
              <p style="margin: 0 0 20px; font-size: 14px; color: #888888; text-align: center;">
                This code expires in 10 minutes.
              </p>
              
              <!-- Security -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #666666; text-align: center; border-top: 1px solid #222222; padding-top: 20px;">
                If you didn't attempt to sign up or log in, you can safely ignore this email. Someone else might have typed your email address by mistake.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #080808; padding: 20px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0; font-size: 11px; color: #555555; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} CarbonXPlanet. All rights reserved.<br>
                Building a sustainable Web3 future.
              </p>
            </td>
          </tr>
        </table>
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

async function sendPasswordResetEmail(toEmail, otpCode) {
  await transporter.sendMail({
    from: `"Carbon X Credit" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your password — OTP Code',
    html: `
      <div style="background-color: #0c0c0c; margin: 0; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 30px 20px;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">CARBON<span style="color: #bef264;">X</span>PLANET</span>
              </div>
              
              <!-- Header -->
              <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 600; color: #ffffff; text-align: center;">Reset your password</h2>
              
              <!-- Body -->
              <p style="margin: 0 0 25px; font-size: 15px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                We received a request to reset your password. Please use the verification code below to set a new password.
              </p>
              
              <!-- OTP Card -->
              <div style="background-color: #050505; border: 1px solid #333333; border-radius: 8px; padding: 24px 20px; text-align: center; margin-bottom: 25px;">
                <h1 style="margin: 0; font-size: 38px; font-weight: 700; letter-spacing: 8px; color: #bef264; font-family: monospace;">${otpCode}</h1>
              </div>
              
              <!-- Expiry -->
              <p style="margin: 0 0 20px; font-size: 14px; color: #888888; text-align: center;">
                This code expires in 10 minutes.
              </p>
              
              <!-- Security -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #666666; text-align: center; border-top: 1px solid #222222; padding-top: 20px;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #080808; padding: 20px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0; font-size: 11px; color: #555555; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} CarbonXPlanet. All rights reserved.<br>
                Building a sustainable Web3 future.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}

async function sendContactMessageEmail({ name, email, phone, message }) {
  const officialEmail = process.env.OFFICIAL_EMAIL || 'carbonxcredit2@gmail.com';
  try {
    await transporter.sendMail({
      from: `"CarbonXPlanet Inquiries" <${process.env.EMAIL_USER}>`,
      to: officialEmail,
      replyTo: email,
      subject: `New Message from ${name} - CarbonXPlanet`,
      html: `
        <div style="background-color: #0c0c0c; margin: 0; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="padding: 35px 30px 20px;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">CARBON<span style="color: #bef264;">X</span>PLANET</span>
                </div>
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #ffffff; text-align: center;">New Contact Inquiry Received</h2>
                <p style="margin: 0 0 25px; font-size: 14px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                  A visitor has submitted a message via the CarbonXPlanet contact form.
                </p>
                <div style="background-color: #181818; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #bef264; text-decoration: none;">${email}</a></p>
                  <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                  <div style="margin-top: 15px; border-top: 1px solid #333333; padding-top: 15px;">
                    <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #bef264; text-transform: uppercase; letter-spacing: 0.5px;">Message:</p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e0e0e0; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>
                <p style="margin: 0; font-size: 12px; color: #777777; text-align: center;">
                  You can reply directly to this email to contact <strong>${name}</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #080808; padding: 15px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
                <p style="margin: 0; font-size: 11px; color: #555555;">
                  Received at ${new Date().toLocaleString()} &bull; CarbonXPlanet Support
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact inquiry email:', err);
  }
}

module.exports = {
  sendOtpEmail,
  sendAgentCredentialsEmail,
  sendPasswordResetEmail,
  sendContactMessageEmail,
};