import toast from "react-hot-toast";

const login = async (formData: {
  email: string;
  password: string;
}): Promise<{
  error?: string;
  message?: string;
  user: {
    iat: number;
    exp: number;
    sessionId: string;
    email: string;
    id: string;
  };
}> => {
  try {
    const request = await fetch("http://localhost:7002/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(formData),
    });
    const response = await request.json();
    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occured.";
    toast.error(message);
    throw err;
  }
};

const signup = async (formData: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{
  error?: string;
  message?: string;
}> => {
  try {
    const query = await fetch("http://localhost:7002/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(formData),
    });

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

export { login, signup };
