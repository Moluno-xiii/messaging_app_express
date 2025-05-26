import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    router.navigate({ to: "/" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <label className="text-primary text-xl font-semibold" htmlFor="email">
          Email
        </label>
        <input
          required
          type="email"
          className="border-foreground focus:border-primary min-w-sm rounded-xl border p-2 transition-all duration-200 outline-none"
          name="email"
          placeholder="$youremail@gmail.com"
        />
      </div>
      <div className="relative flex flex-col gap-y-2">
        <label
          htmlFor="password"
          className="text-primary text-xl font-semibold"
        >
          Password
        </label>
        <input
          required
          minLength={6}
          type={showPassword ? "text" : "password"}
          name="password"
          className="border-foreground focus:border-primary min-w-sm rounded-xl border p-2 transition-all duration-200 outline-none"
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
      <button type="submit" className="btn-fill">
        Login
      </button>
    </form>
  );
}
