import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config.js";

export function startRealtimeServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: config.APP_URL, credentials: true }
  });

  io.on("connection", (socket) => {
    socket.on("conversation:join", (conversationId: string) => socket.join(`conversation:${conversationId}`));
    socket.on("typing", ({ conversationId, userId }) => socket.to(`conversation:${conversationId}`).emit("typing", { conversationId, userId }));
    socket.on("message:send", (message) => {
      io.to(`conversation:${message.conversationId}`).emit("message:new", { ...message, createdAt: new Date().toISOString() });
    });
    socket.on("notification:subscribe", (userId: string) => socket.join(`user:${userId}`));
  });

  httpServer.listen(config.SOCKET_PORT, () => {
    console.log(`Realtime server listening on :${config.SOCKET_PORT}`);
  });

  return io;
}
