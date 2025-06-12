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
import { checkIfUserExists } from "./utils/auth";
import profileRoute from "./routes/profileRoute";

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
app.get("/me", verifyJwt, async (req: Request, res: Response) => {
  const userData = await checkIfUserExists(req.user?.email ?? "");
  if (userData < 1) {
    res.status(404).json({ message: "User doesn't exist", success: false });
    return;
  }

  res.json({
    user: req.user,
    success: true,
    message: "Authenticated successfully!",
  });
});
app.use("/messages", verifyJwt, messagesRoute);
app.use("/notifications", verifyJwt, notificationRoute);
app.use("/profile", verifyJwt, profileRoute);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
