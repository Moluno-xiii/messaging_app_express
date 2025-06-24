import toast from "react-hot-toast";
import type { User } from "../contexts/AuthContext";

const login = async (formData: {
  email: string;
  password: string;
}): Promise<{
  error?: string;
  message?: string;
  user: User;
}> => {
  try {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
    const query = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
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
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const query = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
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
    const request = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify({ email }),
      },
    );
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected error, try again.";
    return { success: false, message };
  }
};

const verifyToken = async (token: string) => {
  try {
    const request = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/verify-email`,
      {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "Application/Json",
        },
      },
    );
    const response = await request.json();
    return response;
  } catch {
    return { success: false, message: "Unexpected error, try again." };
  }
};

const resetPassword = async (data: { token: string; password: string }) => {
  try {
    const request = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify(data),
      },
    );
    const response = await request.json();
    return response;
  } catch {
    toast.error("An unexpected error occured, try again.");
  }
};
export {
  login,
  signup,
  testSignup,
  forgotPassword,
  verifyToken,
  resetPassword,
};
