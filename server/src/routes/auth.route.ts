import express from "express";
import { signIn, signUp, signOut } from "../controllers/auth.controller";
import { sendVerificationOtp } from "../controllers/sendVerificationOtp";
import { authLimiter } from "../middleware/ratelimiter";

const authRouter = express.Router();

authRouter.use(authLimiter);

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-out", signOut);
authRouter.post("/send-verification-otp", sendVerificationOtp);

export default authRouter;
