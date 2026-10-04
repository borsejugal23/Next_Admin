import { Request, Response } from "express";
import {
  getCurrentUser,
  signInUser,
  signUpUser,
} from "../services/auth.service";
import type { SignInBody, SignUpBody } from "../types/auth";

type AuthenticatedRequest = Request & { userId?: string };

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = (req.body ?? {}) as SignInBody;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const result = await signInUser({ email, password });
    if (!result.token) {
      return res.status(401).json({ message: result.message });
    }

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("signIn failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    const { name, email, password, otp } = (req.body ?? {}) as SignUpBody;
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        message: "Name, email, password and OTP are required",
      });
    }
    const result = await signUpUser({ name, email, password, otp });

    if (!result.user) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("signUp failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signOut(req: AuthenticatedRequest, res: Response) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("signOut failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
