import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

import verifyJwt from "./middlewares/verifyJWT";
import authRoute from "./routes/authRoute";
import friendsRoute from "./routes/friendsRoute";
import indexRoute from "./routes/indexRoute";
import messagesRoute from "./routes/messagesRoute";
import notificationRoute from "./routes/notificationRoute";
import profileRoute from "./routes/profileRoute";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socketServer";

const corsOptions = {
  origin: process.env.APP_URL || "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "X-Device-Id"],
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/friends", verifyJwt, friendsRoute);
app.use("/messages", verifyJwt, messagesRoute);
app.use("/notifications", verifyJwt, notificationRoute);
app.use("/profile", verifyJwt, profileRoute);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

const httpServer = createServer(app);

const io = initializeSocket(httpServer);
app.set("socketio", io);

export default httpServer;
