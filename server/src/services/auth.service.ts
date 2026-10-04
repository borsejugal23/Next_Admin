import panelUserModel from "../models/panelUser.model";
import type { SignInBody, SignUpBody } from "../types/auth";
import {
  normalizeEmail,
  verifyEmailOtp,
} from "./verification.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signInUser({ email, password }: SignInBody) {
  try {
    const existUser = await panelUserModel.findOne({ email });
    if (!existUser) {
      return { message: "User not found" };
    }
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return { message: "Invalid password" };
    }

    const secret = process.env.JWT_SECREAT_KEY;
    if (!secret) {
      return { message: "Server misconfiguration: missing SECREAT_KEY" };
    }

    const token = jwt.sign(
      { userId: existUser._id, role: existUser.role },
      secret,
      {
        expiresIn: "7d",
      },
    );
    return {
      message: "User signed in successfully",
      user: {
        _id: existUser._id,
        email: existUser.email,
        role: existUser.role,
        name: existUser.name,
        allowedRoles: existUser.allowedRoles,
      },
      token,
    };
  } catch (error) {
    return { message: "Error signing in", error: error };
  }
}

export async function getCurrentUser(userId: string) {
  return panelUserModel.findById(userId).select("_id email");
}

export async function signUpUser(payload: SignUpBody) {
  const { name, email, password, otp } = payload;
  const normalizedEmail = normalizeEmail(email);

  try {
    const otpResult = await verifyEmailOtp(normalizedEmail, otp);
    if (!otpResult.valid) {
      return { message: otpResult.message };
    }

    const existUser = await panelUserModel.findOne({ email: normalizedEmail });

    if (existUser) {
      return { message: "User already exists" };
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await panelUserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash,
    });

    return {
      message: "User created successfully",
      user: { _id: newUser._id, email: newUser.email },
    };
  } catch (error) {
    return { message: "Error creating user", error: error };
  }
}
