import express from "express";
import { getCart, getCarts } from "../controllers/cart.controller";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorization.middleware";
import apiLimiter from "../middleware/ratelimiter";

const cartsRouter = express.Router();
cartsRouter.use(apiLimiter);
cartsRouter.use(authMiddleware);
cartsRouter.use(authorizeRoles("admin"));

cartsRouter.get("/", getCarts);
cartsRouter.get("/:userId", getCart);

export default cartsRouter;
