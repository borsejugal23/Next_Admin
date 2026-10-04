import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import apiLimiter from "../middleware/ratelimiter";

const chatRouter = Router();

chatRouter.use(apiLimiter);
chatRouter.post("/chat", chatController);

export default chatRouter;
