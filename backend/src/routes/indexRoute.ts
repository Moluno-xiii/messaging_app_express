import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
const indexRoute = Router();

indexRoute.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();
  console.log("users : ", users);
  res.json({ users });
});

indexRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default indexRoute;
