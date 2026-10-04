import express from "express";
import {
  getPanelUsers,
  updatePanelUser,
  deletePanelUser,
} from "../controllers/panelUser.controller";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorization.middleware";
import apiLimiter from "../middleware/ratelimiter";
import { PanelUserRoles } from "../types/user";

const panelUserRouter = express.Router();
panelUserRouter.use(apiLimiter);
panelUserRouter.use(authMiddleware);

panelUserRouter.get("/", getPanelUsers);
panelUserRouter.patch(
  "/:id",
  // authorizeRoles("admin", "moderator"),
  updatePanelUser,
);
panelUserRouter.delete(
  "/:id",
  authorizeRoles(PanelUserRoles.ADMIN),
  deletePanelUser,
);

export default panelUserRouter;
