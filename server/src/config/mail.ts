import dotenv from "dotenv";
import nodemailer from "nodemailer";
import type Transporter from "nodemailer/lib/mailer";

dotenv.config();

function getMailCredentials() {
  const user = process.env.EMAIL_USER?.trim();
  // App passwords are often copied with spaces; Gmail expects no spaces.
  const pass = process.env.EMAIL_PASSWORD?.replace(/\s/g, "");

  return { user, pass };
}

export function isMailConfigured(): boolean {
  const { user, pass } = getMailCredentials();
  return Boolean(user && pass);
}

export function isDevEmailBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.EMAIL_DEV_LOG === "true"
  );
}

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const { user, pass } = getMailCredentials();

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    requireTLS: process.env.EMAIL_SECURE !== "true",
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

export async function verifyMailConnection(): Promise<void> {
  if (!isMailConfigured()) {
    throw new Error("EMAIL_USER and EMAIL_PASSWORD are not configured");
  }

  await getTransporter().verify();
}

export function getMailAuthHelpMessage(): string {
  return [
    "Gmail rejected SMTP login.",
    "Use a Google App Password (not your normal Gmail password):",
    "1. Enable 2-Step Verification on your Google account.",
    "2. Open https://myaccount.google.com/apppasswords",
    "3. Create an app password for Mail.",
    "4. Put that 16-character password in EMAIL_PASSWORD (spaces are OK).",
    "Optional local fallback: set EMAIL_DEV_LOG=true to print OTP in server logs only.",
  ].join(" ");
}
