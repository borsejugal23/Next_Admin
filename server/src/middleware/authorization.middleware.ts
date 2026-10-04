import { Request, Response, NextFunction } from "express";
import panelUserModel from "../models/panelUser.model";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await panelUserModel.findById(req.userId).select("role");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};
