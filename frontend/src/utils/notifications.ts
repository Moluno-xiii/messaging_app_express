import authenticatedFetch from "./authenticatedFetch";

async function getUserNotifications(type: "read" | "unread" | "all" = "all") {
  try {
    const request = await authenticatedFetch(
      `http://localhost:7002/notifications?type=${type}`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    return response;
  } catch (err: unknown) {
    console.error("error occured", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Error getting user notifications, try again.",
    );
  }
}

export { getUserNotifications };
