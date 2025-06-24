import authenticatedFetch from "./authenticatedFetch";

const getMessages = async (friendEmail: string) => {
  try {
    if (!friendEmail) throw new Error("Invalid email,");
    const request = await authenticatedFetch(
      `${import.meta.env.VITE_API_URL}/messages/${friendEmail}`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unexpected error occured, try again",
    );
  }
};
const getLastMessage = async (friendEmail: string) => {
  try {
    if (!friendEmail) throw new Error("Invalid email,");
    const request = await authenticatedFetch(
      `${import.meta.env.VITE_API_URL}/messages/${friendEmail}/last`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unexpected error occured, try again",
    );
  }
};

const sendMessage = async (friendEmail: string, message: string) => {
  try {
    if (!friendEmail) throw new Error("Invalid email,");
    const request = await authenticatedFetch(
      `${import.meta.env.VITE_API_URL}/messages/${friendEmail}`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
    );
    const response = await request.json();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unexpected error occured, try again",
    );
  }
};

export { getMessages, getLastMessage, sendMessage };
