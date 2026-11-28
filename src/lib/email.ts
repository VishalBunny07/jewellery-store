
import "server-only";

import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP configuration is incomplete.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
): Promise<void> {
  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error("SMTP_FROM is not configured.");
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verify your Jewellery Store account",
    text: `Hello ${name},

Your email verification code is ${otp}.

This code expires in 10 minutes.

If you did not create this account, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; color: #333;">
        <h2 style="font-family: Georgia, serif; font-weight: normal;">
          Jewellery Store
        </h2>

        <p>Hello ${escapeHtml(name)},</p>

        <p>Thank you for creating an account with us.</p>

        <p>Your email verification code is:</p>

        <div style="background: #f5f0e9; padding: 20px; text-align: center; letter-spacing: 10px; font-size: 30px; font-weight: bold;">
          ${otp}
        </div>

        <p>This code expires in <strong>10 minutes</strong>.</p>

        <p style="font-size: 12px; color: #777;">
          If you did not create this account, you can ignore this email.
        </p>
      </div>
    `,
  });
}
