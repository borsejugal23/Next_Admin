import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

type JwtAuthPayload = {
  userId?: unknown;
  role?: unknown;
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const unauthorized = () => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(401).json({ message: "Unauthorized" });
  };

  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return unauthorized();
    }

    const secret = process.env.JWT_SECREAT_KEY;
    if (!secret) {
      return res
        .status(500)
        .json({ message: "Server misconfiguration: missing JWT_SECREAT_KEY" });
    }

    const decoded = jwt.verify(token, secret) as JwtAuthPayload;
    const userId = decoded?.userId == null ? "" : String(decoded.userId).trim();

    if (!userId) {
      return unauthorized();
    }

    req.userId = userId;
    req.role = decoded.role;
    return next();
  } catch {
    return unauthorized();
  }
};

export default authMiddleware;
