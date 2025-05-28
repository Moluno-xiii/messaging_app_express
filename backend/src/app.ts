import "dotenv/config";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/indexRoute";
import authRoute from "./routes/authRoute";
import verifyJwt from "./middlewares/verifyJWT";

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
app.get("/me", verifyJwt, (req: Request, res: Response) => {
  res.json({ user: req.user });
});
app.get("/messages", verifyJwt, (req: Request, res: Response) => {
  res.json({ message: "Welcome to the protected route" });
});
app.use("/auth", authRoute);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
