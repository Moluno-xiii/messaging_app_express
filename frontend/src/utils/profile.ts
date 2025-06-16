import type { User } from "../contexts/AuthContext";
import authenticatedFetch from "./authenticatedFetch";

const getUserProfile = async (): Promise<{
  message: string;
  success: boolean;
  user: User | null;
}> => {
  try {
    const request = await authenticatedFetch("http://localhost:7002/profile", {
      method: "GET",
    });
    const response = await request.json();
    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occured while getting user Profile, try again";
    return {
      message,
      success: false,
      user: null,
    };
  }
};

const updateUserProfile = async (
  profilePic: string,
  displayName: string,
): Promise<{ message?: string; success: boolean }> => {
  try {
    const request = await authenticatedFetch("http://localhost:7002/profile", {
      method: "PATCH",
      body: JSON.stringify({
        profilePic,
        displayName,
      }),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while updating profile, try again.";
    return {
      success: false,
      message,
    };
  }
};

export { getUserProfile, updateUserProfile };
