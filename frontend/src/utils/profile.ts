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
    console.log("response from getuserprofile", response);
    return response;
  } catch (error: unknown) {
    console.error("Error occured while getting user profile :", error);
    return {
      message:
        "An unexpected error occured while getting user Profile, try again",
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
    console.log("I ran to update user profile");
    const request = await authenticatedFetch("http://localhost:7002/profile", {
      method: "PATCH",
      body: JSON.stringify({
        profilePic,
        displayName,
      }),
    });
    const response = await request.json();
    console.log("response from updateUserProfile :", response);
    return response;
  } catch (error: unknown) {
    console.error("Error occured while updating user profile :", error);
    return {
      success: false,
      message: "Unexpected error while updating profile, try again.",
    };
  }
};

export { getUserProfile, updateUserProfile };
