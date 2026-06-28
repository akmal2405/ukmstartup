import nodemailer from "nodemailer";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(toEmail, token) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await getTransporter().sendMail({
    from: `"UKMStartUp" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your UKMStartUp password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <div style="background:linear-gradient(135deg,#9B59D0,#E8745A);padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px">UKMStartUp</h1>
        </div>
        <div style="padding:32px 24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 8px;font-size:18px;color:#111">Reset your password</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
            Click the button below to set a new password for your UKMStartUp account.
            This link expires in <strong>15 minutes</strong>.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#9B59D0,#E8745A);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
            Reset Password
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;line-height:1.5">
            If you didn't request a password reset you can safely ignore this email.<br>
            ${resetUrl}
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendVerificationEmail(toEmail, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await getTransporter().sendMail({
    from: `"UKMStartUp" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your UKMStartUp email",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <div style="background:linear-gradient(135deg,#9B59D0,#E8745A);padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px">UKMStartUp</h1>
        </div>
        <div style="padding:32px 24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 8px;font-size:18px;color:#111">Verify your email address</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
            Click the button below to confirm your UKMStartUp account.
            This link expires in <strong>24 hours</strong>.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#9B59D0,#E8745A);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
            Verify Email
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;line-height:1.5">
            If you didn't create an account you can safely ignore this email.<br>
            ${verifyUrl}
          </p>
        </div>
      </div>
    `,
  });
}
