import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PasswordInput } from "../../components/Ui/Input";
import useAuth from "../../hooks/useAuth";
import { resetPassword } from "../../utils/auth";

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
  const { user } = useAuth();
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

    if (!token) {
      toast.error("Invalid link, click on the link sent to your email.");
      setIsLoading(false);
      return;
    }

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

  const isDisabled = isLoading || !token || user ? true : false;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="password"
          className="text-primary text-base font-semibold"
        >
          New password
        </label>
        <PasswordInput name="password" isDisabled={isDisabled} />
      </div>
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-primary text-base font-semibold"
        >
          Confirm new Password
        </label>
        <PasswordInput name="confirmPassword" isDisabled={isDisabled} />
      </div>

      <button disabled={isDisabled} type="submit" className="btn-fill">
        {isLoading ? "Resetting password..." : "Reset password"}
      </button>
    </form>
  );
}
