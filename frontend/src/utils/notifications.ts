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
    console.error("error getting user notifications :", err);
  }
}

export { getUserNotifications };
