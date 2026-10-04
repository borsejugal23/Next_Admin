import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import cartsRouter from "./routes/carts.route";
import panelUserRouter from "./routes/panelUser.route";
import productRouter from "./routes/product.route";
import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.routes";
// import dotenv from "dotenv";

// dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use("/auth", authRouter);
app.use("/carts", cartsRouter);
app.use("/panel-users", panelUserRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/api", chatRouter);
app.get("/", (req, res) => res.send("Application is on running mode"));
export default app;
