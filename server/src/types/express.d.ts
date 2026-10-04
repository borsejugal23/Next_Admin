import "express-serve-static-core";
import type { PanelUserRole } from "../constants/roles";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    role?: PanelUserRole;
  }
}
