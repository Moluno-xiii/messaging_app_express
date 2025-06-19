import { SendNotification } from "../../types/express/socketHandlerTypes";
import prisma from "../prisma";

async function getAllUserNotifications(
  email: string,
  type: "read" | "unread" | "all"
) {
  try {
    const request = await prisma.notification.findMany({
      where: {
        email,
        ...(type !== "all" && {
          hasUserRead: type === "read",
        }),
      },
    });
    return request;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Unexpected error occured"
    );
  }
}

const deleteNotification = async (email: string, id: string) => {
  try {
    const request = await prisma.notification.delete({
      where: {
        email,
        id,
      },
    });
    return {
      success: true,
      message: "Notification deleted successfully",
    };
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Error deleting notification."
    );
  }
};

const sendNotification = async (notificationData: SendNotification) => {
  try {
    const request = await prisma.notification.create({
      data: notificationData,
    });
    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Error sending notification."
    );
  }
};

const deleteNotificationByStatus = async (
  status: "read" | "unread" | "all",
  email: string
) => {
  try {
    const whereClause =
      status === "all"
        ? { email }
        : {
            email,
            hasUserRead: status === "read",
          };

    const deleted = await prisma.notification.deleteMany({
      where: whereClause,
    });
    return deleted;
  } catch (err) {
    console.error(err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Error deleting notifications, try again."
    );
  }
};

export {
  getAllUserNotifications,
  deleteNotification,
  sendNotification,
  deleteNotificationByStatus,
};
