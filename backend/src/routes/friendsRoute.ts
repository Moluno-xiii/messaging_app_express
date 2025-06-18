import { NextFunction, Request, Response, Router } from "express";
import prisma from "../prisma";
import { sendNotification } from "../utils/notifications";
import { addFriend, deleteFriendRequest } from "../utils/friends";
import { Server } from "socket.io";
import { getUserSockets } from "../socket/socketMap";
const friendsRoute = Router();

friendsRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            { friendEmail: req.user?.email },
            { userEmail: req.user?.email },
          ],
        },
        include: {
          friend: {
            include: {
              ProfileEmail: true,
            },
          },
          user: {
            include: {
              ProfileEmail: true,
            },
          },
        },
      });

      const normalizedFriends = friends.map((friendEntry) => {
        const isInitiator = friendEntry.userEmail === req.user?.email;
        const friendData = isInitiator ? friendEntry.friend : friendEntry.user;

        return {
          ...friendData,
          friendshipStatus: friendEntry.status,
        };
      });

      res.status(200).json({
        success: true,
        data: normalizedFriends,
        detailedData: friends,
        message: "Friends fetched successfully",
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

friendsRoute.post(
  "/request",
  async (req: Request, res: Response, next: NextFunction) => {
    const { friendEmail } = req.body;
    const io = req.app.get("socketio") as Server;
    if (friendEmail === req.user?.email) {
      res.status(200).json({
        message: "You can't send a friend request to your own email.",
        success: false,
      });
      return;
    }
    try {
      const doesFriendAlreadyExist = await prisma.friend.count({
        where: {
          OR: [
            {
              friendEmail,
              userEmail: req.user?.email,
            },
            {
              friendEmail: req.user?.email,
              userEmail: friendEmail,
            },
          ],
        },
      });

      if (doesFriendAlreadyExist > 0) {
        res
          .status(200)
          .json({ message: "User is already your friend.", success: false });
        return;
      }
      const requestId = crypto.randomUUID();
      const currentDate = new Date();
      const friendSocket = getUserSockets(friendEmail);
      friendSocket.forEach((id) => {
        io.to(id).emit("receive_friend_request", {
          requestedToEmail: friendEmail,
          requesterEmail: req.user?.email as string,
          id: requestId,
          dateSent: currentDate.toISOString(),
          dateResponded: currentDate.toISOString(),
          status: "PENDING",
        });
      });
      await prisma.request.create({
        data: {
          requestedToEmail: friendEmail,
          requesterEmail: req.user?.email as string,
          id: requestId,
          dateSent: currentDate.toISOString(),
        },
      });
      res.status(200).json({ message: "Friend request sent.", success: true });
    } catch (err) {
      if (
        (err as any).code === "P2002" &&
        (err as any).meta?.target?.includes("requesterEmail")
      ) {
        res.status(409).json({
          message: "You already sent a request to this email!",
          success: false,
        });
        return;
      }
      handleError(err, res);
    }
  }
);

friendsRoute.get(
  "/request/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    try {
      const requests = await prisma.request.findMany({
        where: {
          requestedToEmail: type === "received" ? req.user?.email : undefined,
          requesterEmail: type === "sent" ? req.user?.email : undefined,
          status: "PENDING",
        },
      });
      res.status(200).json({
        requests,
        success: true,
        message: `${type} messages fetched successfully`,
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

friendsRoute.put(
  "/request/:requestId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const { requesterEmail, requesteeEmail } = req.body;
    try {
      const request = await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: req.body.status,
        },
      });

      if (req.body.status === "ACCEPTED") {
        await addFriend(requesteeEmail, requesterEmail);
      }
      await deleteFriendRequest(requestId);
      await sendNotification(
        requesterEmail,
        `Your friend request to ${requesteeEmail} has been ${req.body.status}.`,
        `${req.body.status} friend request.`
      );
      res.status(200).json({
        success: true,
        request,
        message: `Request ${req.body.status} successfully!`,
      });
      return;
    } catch (err: unknown) {
      handleError(err, res);
    }
  }
);

friendsRoute.delete(
  "/request/:requestId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteFriendRequest(req.params.requestId);
      res
        .status(200)
        .json({ message: "Request deleted successfully!", success: true });
    } catch (err: unknown) {
      handleError(err, res);
    }
  }
);

export default friendsRoute;

export const handleError = (err: unknown, res: Response) => {
  res.status(500).json({
    message: err instanceof Error ? err.message : "An unexpected error occured",
    success: false,
  });
  return;
};
