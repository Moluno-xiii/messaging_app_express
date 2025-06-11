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

const testSignup = async (formData: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const query = await fetch("http://localhost:7002/auth/test-signup", {
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

const forgotPassword = async (email: string) => {
  try {
    const request = await fetch("http://localhost:7002/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "Application/Json",
      },
      body: JSON.stringify({ email }),
    });
    const response = await request.json();
    console.log("response from forgot password endpoint : ", response);
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected error, try again.";
    console.error("errror while requesting forgot password route: ", error);
    return { success: false, message };
  }
};
export { login, signup, testSignup, forgotPassword };
