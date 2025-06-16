import authenticatedFetch from "./authenticatedFetch";

async function getUserNotifications() {
  try {
    const request = await authenticatedFetch(
      `http://localhost:7002/notifications`,
      {
        method: "GET",
      },
    );
    return await request.json();
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Error getting user notifications, try again.",
    );
  }
}

export { getUserNotifications };
