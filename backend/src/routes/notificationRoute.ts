import { NextFunction, Request, Response, Router } from "express";
import {
  deleteNotification,
  getAllUserNotifications,
} from "../utils/notifications";
import { handleError } from "./friendsRoute";

const notificationRoute = Router();

notificationRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await getAllUserNotifications(
        req.user?.email as string
      );
      res.status(200).json({
        success: true,
        data: notifications,
        message: "Notifications fetched successfully!",
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

notificationRoute.delete(
  "/:notificationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await deleteNotification(
        req.user?.email as string,
        req.params.notificationId
      );
      console.log("Delete notification route response : ", response);
      // I haven't tested this
    } catch (err) {
      console.log("Error deleting messages", err);
      handleError(err, res);
    }
  }
);

export default notificationRoute;
