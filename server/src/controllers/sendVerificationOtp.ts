import { Request, Response } from "express";
import {
  getEmailSendErrorMessage,
  sendVerificationOtpEmail,
} from "../services/email.service";
import {
  createEmailVerificationOtp,
  emailAlreadyRegistered,
  isValidEmail,
  normalizeEmail,
} from "../services/verification.service";

export const sendVerificationOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body ?? {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (await emailAlreadyRegistered(normalizedEmail)) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = await createEmailVerificationOtp(normalizedEmail);
    const result = await sendVerificationOtpEmail(normalizedEmail, otp);

    if (result.devLogged) {
      return res.status(200).json({
        message:
          "Verification OTP generated. Check the server console (EMAIL_DEV_LOG=true).",
      });
    }

    return res.status(200).json({
      message: "Verification OTP sent to your email",
    });
  } catch (error) {
    console.error("sendVerificationOtp failed:", error);

    const emailErrorMessage = getEmailSendErrorMessage(error);
    if (emailErrorMessage) {
      return res.status(503).json({ message: emailErrorMessage });
    }

    return res.status(500).json({ message: "Failed to send verification OTP" });
  }
};
