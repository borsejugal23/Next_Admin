import panelUserModel from "../models/panelUser.model";
import { EmailVerification } from "../models/EmailVerification";

const OTP_TTL_MS = 10 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createEmailVerificationOtp(email: string): Promise<string> {
  const normalizedEmail = normalizeEmail(email);
  const otp = generateOtp();

  await EmailVerification.deleteMany({ email: normalizedEmail });
  await EmailVerification.create({
    email: normalizedEmail,
    otp,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  return otp;
}

export async function verifyEmailOtp(
  email: string,
  otp: string,
): Promise<{ valid: true } | { valid: false; message: string }> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedOtp = otp.trim();

  if (!normalizedOtp) {
    return { valid: false, message: "OTP is required" };
  }

  const verification = await EmailVerification.findOne({
    email: normalizedEmail,
  }).sort({ createdAt: -1 });

  if (!verification) {
    return { valid: false, message: "OTP not found. Please request a new one." };
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    await EmailVerification.deleteMany({ email: normalizedEmail });
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }

  if (verification.otp !== normalizedOtp) {
    return { valid: false, message: "Invalid OTP" };
  }

  await EmailVerification.deleteMany({ email: normalizedEmail });
  return { valid: true };
}

export async function emailAlreadyRegistered(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await panelUserModel.exists({ email: normalizedEmail });
  return Boolean(existingUser);
}
