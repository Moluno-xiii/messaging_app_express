import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
const indexRoute = Router();

indexRoute.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

indexRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "" });
  } catch (err) {
    next(err);
  }
});

export default indexRoute;
