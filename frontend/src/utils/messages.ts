import authenticatedFetch from "./authenticatedFetch";

const getMessages = async (friendEmail: string) => {
  try {
    if (!friendEmail) throw new Error("Invalid email,");
    const request = await authenticatedFetch(
      `http://localhost:7002/messages/${friendEmail}`,
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
      `http://localhost:7002/messages/${friendEmail}/last`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    console.log("Lat message fn data", response);
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
      `http://localhost:7002/messages/${friendEmail}`,
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
