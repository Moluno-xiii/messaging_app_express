import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/auth/reset-password")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      token: search.token as string,
    };
  },
});

function RouteComponent() {
  const { token } = useSearch({ from: Route.id });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as unknown as {
      password: string;
      confirmPassword?: string;
    };
    if (data.password !== data.confirmPassword) {
      toast.error("Password fields do not match.");
      setIsLoading(false);
      return;
    }
    // if (data.otp.length < 4 || data.otp.length > 4) {
    //   toast.error("OTP length must be 4");
    // }
    delete data.confirmPassword;
    const finalData = { ...data, token } as { token: string; password: string };
    try {
      const { message, success } = await resetPassword(finalData);
      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);
      setTimeout(() => {
        navigate({ to: "/auth/login", replace: true });
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: { token: string; password: string }) => {
    try {
      const request = await fetch("http://localhost:7002/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify(data),
      });
      const response = await request.json();
      console.log("response from reset password endpoint : ", response);
      return response;
    } catch (error) {
      toast.error("An unexpected error occured, try again.");
      console.error(error, "message from reset password");
    }
  };

  // const handleResetOTP = () => {
  //   console.log("OTP resent");
  //   toast.success(`OTP sent successfully to ${email}`);
  // };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {/* <div className="flex flex-col gap-y-2">
        <label className="text-primary text-base font-semibold" htmlFor="otp">
          Enter OTP sent to your email
        </label>
        <input
          required
          type="number"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
          name="otp"
        />
      </div> */}
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="password"
          className="text-primary text-base font-semibold"
        >
          New password
        </label>
        <input
          required
          minLength={6}
          type="password"
          name="password"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
        />
      </div>
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-primary text-base font-semibold"
        >
          Confirm new Password
        </label>
        <input
          required
          minLength={6}
          type="password"
          name="confirmPassword"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
        />
      </div>

      <button disabled={isLoading} type="submit" className="btn-fill">
        {isLoading ? "Resetting password..." : "Reset password"}
      </button>

      {/* {email ? (
        <div>
          <span>Didn't receive email?</span>
          <button type="button" onClick={handleResetOTP} className="btn-fill">
            Resend OTP
          </button>
        </div>
      ) : null} */}
    </form>
  );
}
