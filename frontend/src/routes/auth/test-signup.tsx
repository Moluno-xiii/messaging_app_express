import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { testSignup } from "../../utils/auth";

export const Route = createFileRoute("/auth/test-signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      email: string;
      password: string;
      confirmPassword: string;
    };
    if (data.password !== data.confirmPassword) {
      toast.error("Password fields do not match!");
      setIsLoading(false);
      return;
    }

    const { message, success } = await testSignup(data);

    if (!success) {
      toast.error(message);
      setIsLoading(false);
    } else {
      toast.success(message);
      setIsLoading(false);
      event.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <label className="text-primary text-base font-semibold" htmlFor="email">
          Email
        </label>
        <input
          required
          type="email"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
          name="email"
          placeholder="$your_email@gmail.com"
        />
      </div>
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="password"
          className="text-primary text-base font-semibold"
        >
          Password
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
          Confirm Password
        </label>
        <input
          required
          minLength={6}
          type="password"
          name="confirmPassword"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
        />
      </div>
      <button
        disabled={isLoading}
        type="submit"
        className="btn-fill disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing up..." : "Signup"}
      </button>
      <Link
        className="text-primary hover:text-primary/70 transition-all duration-200 hover:underline"
        to={"/auth/forgot-password"}
      >
        Forgot password?
      </Link>
      <Link
        className="text-primary hover:text-primary/70 transition-all duration-200 hover:underline"
        to={"/auth/verify-email"}
        search={{ token: "20302502u02u20u2wlgwo" }}
      >
        Verify email
      </Link>
    </form>
  );
}
