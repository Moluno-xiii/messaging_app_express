import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import { login } from "../../utils/auth";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formBody = Object.fromEntries(formData) as {
      email: string;
      password: string;
    };
    const { user, error, message } = await login(formBody);
    if (error) {
      setIsLoading(false);
      toast.error(error);
      throw new Error(error);
    } else {
      setUser(user);
      toast.success(message ?? "Login successful");
      router.navigate({ to: "/chat", replace: true });
      setIsLoading(false);
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
          type={showPassword ? "text" : "password"}
          name="password"
          className="border-foreground focus:border-primary w-full rounded-xl border p-2 transition-all duration-200 outline-none md:min-w-sm"
        />
        {showPassword ? (
          <IoEyeOffOutline
            className="hover:text-primary absolute right-2 bottom-3 cursor-pointer transition-all duration-300"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <IoEyeOutline
            className="hover:text-primary absolute right-2 bottom-3 cursor-pointer transition-all duration-300"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
      <button type="submit" className="btn-fill disabled:cursor-not-allowed">
        {isLoading ? "Logging in..." : "       Login"}
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
