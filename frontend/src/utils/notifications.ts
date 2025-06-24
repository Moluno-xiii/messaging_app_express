import authenticatedFetch from "./authenticatedFetch";

async function getUserNotifications(type: "read" | "unread" | "all" = "all") {
  try {
    const request = await authenticatedFetch(
      `${import.meta.env.VITE_API_URL}/notifications?type=${type}`,
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
