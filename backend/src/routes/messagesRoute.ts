import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { handleError } from "./friendsRoute";

const messagesRoute = Router();

messagesRoute.get(
  "/:friendEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              sender_id: req.user?.email,
              receiver_id: req.params.friendEmail,
            },
            {
              sender_id: req.params.friendEmail,
              receiver_id: req.user?.email,
            },
          ],
        },
      });
      res.status(200).json({
        message: "Fetched messages successfully!",
        success: true,
        data: messages,
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

messagesRoute.post(
  "/:friendEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await prisma.message.create({
        data: {
          sender_id: req.user?.email as string,
          receiver_id: req.params.friendEmail,
          messge: req.body.message,
        },
      });
      res.status(200).json({
        message: "Sent message successfully",
        success: true,
        data: null,
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

messagesRoute.delete(
  "/:userId/messageId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, messageId } = req.params;
    try {
      const message = await prisma.message.delete({
        where: {
          sender_id: req.user?.id as string,
          receiver_id: userId,
          id: messageId,
        },
      });
      // haven't tested this yet
      console.log("Newly deleted message : ", message);
      res.status(200).json({ message: "Message deleted successfully!" });
    } catch (err) {
      console.error("An error occured while trying to delete message :", err);
      res
        .status(500)
        .json({ error: "An error ocured while trying to delete message" });
    }
  }
);

export default messagesRoute;
