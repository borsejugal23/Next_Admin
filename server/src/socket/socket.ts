import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

const clientOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_ORIGIN,
].filter(Boolean) as string[];

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow same-origin tools / non-browser clients with no Origin
        if (!origin || clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        // Dev convenience: allow LAN access like http://192.168.x.x:3000
        if (
          process.env.NODE_ENV !== "production" &&
          /^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)[\d.]+:3000$/.test(
            origin,
          )
        ) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`), false);
      },
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};
