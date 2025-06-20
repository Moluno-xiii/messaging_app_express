import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { handleError } from "./friendsRoute";
import { Server } from "socket.io";
import { getDateAndId } from "../socket/handlers/notificationHandler";
import { emit } from "../socket/socketServer";

const messagesRoute = Router();

messagesRoute.get(
  "/:friendEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: req.user?.email,
              receiverId: req.params.friendEmail,
            },
            {
              senderId: req.params.friendEmail,
              receiverId: req.user?.email,
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

messagesRoute.get("/:friendEmail/last", async (req: Request, res: Response) => {
  try {
    const lastMessage = await prisma.message.findFirst({
      where: {
        OR: [
          {
            senderId: req.user?.email,
            receiverId: req.params.friendEmail,
          },
          {
            senderId: req.params.friendEmail,
            receiverId: req.user?.email,
          },
        ],
      },
      orderBy: {
        date_created: "desc",
      },
    });

    res.status(200).json({
      message: "Message fetched successfully",
      success: true,
      data: lastMessage,
    });
  } catch (err) {
    console.error("error while fetching user last message", err);
    handleError(err, res);
  }
});

messagesRoute.post(
  "/:friendEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    const io = req.app.get("socketio") as Server;
    const { date, id } = getDateAndId();

    const messageData = {
      senderId: req.user?.email as string,
      receiverId: req.params.friendEmail,
      mesasge: req.body.message,
      id,
      date_created: date,
      date_updated: date,
    };

    try {
      await prisma.message.create({
        data: messageData,
      });
      emit(req.params.friendEmail, "receive_message", io, messageData);
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
          senderId: req.user?.id as string,
          receiverId: userId,
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
