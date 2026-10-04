import express from "express";
import {
  getUser,
  getUsers,
  getUserReview,
} from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorization.middleware";
import apiLimiter from "../middleware/ratelimiter";

const userRouter = express.Router();
userRouter.use(apiLimiter);
userRouter.use(authMiddleware);
userRouter.use(authorizeRoles("admin", "moderator"));

userRouter.get("/", getUsers);
userRouter.get("/review", getUserReview);
userRouter.get("/:id", getUser);

export default userRouter;
