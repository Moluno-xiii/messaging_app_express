import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { PasswordInput } from "../../components/Ui/Input";
import useAuth from "../../hooks/useAuth";
import { testSignup } from "../../utils/auth";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      email: string;
      password: string;
      confirmPassword?: string;
    };
    if (data.password !== data.confirmPassword) {
      toast.error("Password fields do not match!");
      setIsLoading(false);
      return;
    }
    delete data.confirmPassword;
    const { message, success } = await testSignup(data);

    if (!success) {
      toast.error(message);
      setIsLoading(false);
    } else {
      toast.success(message);
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || user ? true : false;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <label className="text-primary text-base font-semibold" htmlFor="email">
          Email
        </label>
        <input
          required
          disabled={isDisabled}
          type="email"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none disabled:cursor-not-allowed max-sm:w-xs md:min-w-sm"
          name="email"
          placeholder="$your_email@gmail.com"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <label
          htmlFor="password"
          className="text-primary text-base font-semibold"
        >
          Password
        </label>
        <PasswordInput name="password" isDisabled={isDisabled} />
      </div>
      <div className="flex flex-col gap-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-primary text-base font-semibold"
        >
          Confirm Password
        </label>
        <PasswordInput name="confirmPassword" isDisabled={isDisabled} />
      </div>
      <button
        disabled={isDisabled}
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
    </form>
  );
}
