import { createFileRoute, useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (data.password !== data.confirmPassword) {
      toast.error("Password fields do not match!");
      return;
    }
    console.log(data);
    try {
      const query = await fetch("http://localhost:7002/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      });
      const { message, error } = await query.json();

      if (error) {
        throw new Error(error);
      } else {
        router.navigate({ to: "/auth/login", replace: true });
        toast.success(message);
      }

      return;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occured, try again.";
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
          type="password"
          name="password"
          className="border-foreground focus:border-primary min-w-sm rounded-xl border p-2 transition-all duration-200 outline-none"
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
          className="border-foreground focus:border-primary min-w-sm rounded-xl border p-2 transition-all duration-200 outline-none"
        />
      </div>
      <button type="submit" className="btn-fill">
        Signup
      </button>
    </form>
  );
}
