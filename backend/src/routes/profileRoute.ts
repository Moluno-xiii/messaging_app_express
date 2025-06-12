import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
const profileRoute = Router();

profileRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProfile = await prisma.profile.findUnique({
        where: {
          email: req.user?.email,
        },
      });
      res.status(200).json({
        user: userProfile,
        message: "Fetched user profile successfully",
        success: true,
      });
    } catch (error: unknown) {
      console.error("Error getting user profile", error);
      res
        .status(500)
        .json({ message: "Unexpected error, try again", success: false });
    }
  }
);

profileRoute.patch(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { profilePic, displayName } = req.body;
    console.log("request body", req.body);
    try {
      await prisma.profile.update({
        where: {
          email: req.user?.email,
        },
        data: {
          profilePic,
          displayName,
        },
      });
      res.status(200).json({ message: "" });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default profileRoute;
