import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifySessionToken } from "../utils/auth";
import { CustomSocket } from "../../types/express/socket";
import * as cookie from "cookie";
import messageHandler from "./handlers/messageHandler";
import { addUserSocket, getUserSockets, removeUserSocket } from "./socketMap";
import { HandlerPayloads } from "../../types/express/socketHandlerTypes";
import prisma from "../prisma";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.APP_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Device-Id"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    allowUpgrades: true,
  });

  io.use(async (socket: CustomSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        return next(new Error("No cookies found"));
      }
      const parsedCookie = cookie.parse(rawCookie);
      const token = parsedCookie["accessToken"];
      if (!token) {
        return next(new Error("Authorization token required."));
      }

      const decoded = verifySessionToken(token);
      if (!decoded) {
        throw new Error("Invalid token");
      }
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      console.error("Error connecting to Socket", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log(`User ${socket.userEmail} connected with ${socket.id}`);
    const userId = socket.userEmail as string;

    if (userId) {
      addUserSocket(userId, socket.id);
    }

    // messageHandler(socket, io);
    socket.on("read_notification", async (id) => {
      await prisma.notification.update({
        where: {
          id,
        },
        data: {
          hasUserRead: true,
        },
      });

      // frontend sends ws_handler request.
      // matches this handler.
      // updates on backend.
    });
    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.userEmail} disconnected due to  ${reason}`);
      removeUserSocket(userId, socket.id);
    });
  });

  return io;
};

const emit = (
  id: string,
  event: string,
  io: Server,
  payload?: HandlerPayloads
) => {
  const receiverSocketIds = getUserSockets(id);

  receiverSocketIds.forEach((id) => {
    io.to(id).emit(event, payload);
  });
};

export { emit };
