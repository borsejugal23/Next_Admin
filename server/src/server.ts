import app from "./app";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { initializeSocket } from "./socket/socket";
dotenv.config();
const port = (process.env.PORT as string) || 8080;
const server = createServer(app);
// Initialize Socket.IO
initializeSocket(server);
server.listen(port, () => console.log(`😀 Server is running on port ${port}`));
