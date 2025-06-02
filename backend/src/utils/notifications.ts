import prisma from "../prisma";

async function getAllUserNotifications(email: string) {
  try {
    const request = await prisma.notification.findMany({
      where: {
        email,
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
    console.log("notification request : ", request);
    return {
      success: true,
      message: "Notification deleted successfully",
    };
  } catch (err) {
    console.error(err);
    throw new Error(
      err instanceof Error ? err.message : "Error deleting notifications."
    );
  }
};

const sendNotification = async (
  email: string,
  message: string,
  title: string
) => {
  try {
    const request = await prisma.notification.create({
      data: {
        email,
        title,
        message,
      },
    });
    console.log("notification request : ", request);
    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (err) {
    console.error(err);
    throw new Error(
      err instanceof Error ? err.message : "Error deleting notifications."
    );
  }
};

export { getAllUserNotifications, deleteNotification, sendNotification };
