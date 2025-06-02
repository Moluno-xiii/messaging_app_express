import toast from "react-hot-toast";
import authenticatedFetch from "./authenticatedFetch";
import type { FriendRequestStatus } from "../types";

const addFriend = async (formData: {
  friendEmail: string;
}): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const query = await authenticatedFetch(
      "http://localhost:7002/friends/request",
      {
        method: "POST",
        body: JSON.stringify(formData),
      },
    );

    return await query.json();
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occured, try again.";
    toast.error(message);
    throw err;
  }
};

const getFriendRequests = async (type: "sent" | "received") => {
  try {
    const request = await authenticatedFetch(
      `http://localhost:7002/friends/request/${type}`,
      {
        method: "GET",
      },
    );

    const response = await request.json();
    if (!response.success) {
      throw new Error(
        response.message ?? "Error occured while fetching friend requests.",
      );
    }

    return response;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Something went wrong while getting user friend requests!",
    );
  }
};

const respondToFriendRequest = async (
  requestId: string,
  requesterEmail: string,
  requesteeEmail: string,
  status: FriendRequestStatus,
) => {
  try {
    const request = await authenticatedFetch(
      `http://localhost:7002/friends/request/${requestId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status, requesterEmail, requesteeEmail }),
      },
    );

    const response = await request.json();
    if (!response.success) {
      throw new Error(
        response.message || "Failed to respond to friend request",
      );
    }
    return response;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Failed to respond to friend request, try again",
    );
  }
};

const deleteFriendRequest = async (requestId: string) => {
  try {
    const request = await authenticatedFetch(
      `http://localhost:7002/friends/request/${requestId}`,
      {
        method: "DELETE",
      },
    );
    const response = await request.json();
    if (!response.success) {
      throw new Error(response.message || "Failed to delete friend request");
    }
    return response;
  } catch (err) {
    console.error("error occured while deleting friend request", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unexpected error occured, try again",
    );
  }
};

async function fetchUserFriends() {
  try {
    const request = await authenticatedFetch(`http://localhost:7002/friends`, {
      method: "GET",
    });
    const response = await request.json();

    if (!response.success) {
      throw new Error(response.message ?? "Something went wrong, try again");
    }
    return response;
  } catch (err: unknown) {
    console.error("Error occured while fething friends : ", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unexpected error occured, try again",
    );
  }
}

export {
  addFriend,
  getFriendRequests,
  respondToFriendRequest,
  deleteFriendRequest,
  fetchUserFriends,
};
