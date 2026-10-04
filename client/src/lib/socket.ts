"use client";

import { io } from "socket.io-client";

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:8080";

export const socket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
});
