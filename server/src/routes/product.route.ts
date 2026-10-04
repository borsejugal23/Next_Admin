import express from "express";
import {
  getProduct,
  getProducts,
  patchProduct,
} from "../controllers/product.controller";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorization.middleware";
import apiLimiter from "../middleware/ratelimiter";

const productRouter = express.Router();
productRouter.use(apiLimiter);
productRouter.use(authMiddleware);

productRouter.get(
  "/",
  authorizeRoles("admin", "moderator", "panel_user"),
  getProducts,
);
productRouter.get(
  "/:id",
  authorizeRoles("admin", "moderator", "panel_user"),
  getProduct,
);
productRouter.patch("/:id", authorizeRoles("admin"), patchProduct);

export default productRouter;
