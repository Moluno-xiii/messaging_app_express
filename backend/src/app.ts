import "dotenv/config";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/indexRoute";
import authRoute from "./routes/authRoute";
import verifyJwt from "./middlewares/verifyJWT";
import messagesRoute from "./routes/messagesRoute";
import friendsRoute from "./routes/friendsRoute";
import notificationRoute from "./routes/notificationRoute";

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
app.get("/me", verifyJwt, (req: Request, res: Response) => {
  res.json({ user: req.user });
});
app.use("/messages", verifyJwt, messagesRoute);
app.use("/notifications", verifyJwt, notificationRoute);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
