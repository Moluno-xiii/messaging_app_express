import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formBody = Object.fromEntries(formData);
    console.log(formBody);

    try {
      const query = await fetch("http://localhost:7002/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(formBody),
      });
      const { error, message } = await query.json();

      if (error) {
        throw new Error(error);
      } else {
        console.log("login data : ", message);
        toast.success(message);
        router.navigate({ to: "/", replace: true });
      }
      return;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occured.";
      toast.error(message);
      console.error(err);
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
          className="border-foreground focus:border-primary min-w-sm rounded-xl border p-2 transition-all duration-200 outline-none"
          name="email"
          placeholder="$youremail@gmail.com"
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
