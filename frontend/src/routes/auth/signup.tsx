import { createFileRoute, useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { signup } from "../../utils/auth";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      email: string;
      password: string;
      confirmPassword: string;
    };
    if (data.password !== data.confirmPassword) {
      toast.error("Password fields do not match!");
      return;
    }

    const { message, error } = await signup(data);

    if (error) {
      toast.error(error);
    } else {
      router.navigate({ to: "/auth/login", replace: true });
      toast.success(message ?? "Signup sucessful");
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
      <button type="submit" className="btn-fill">
        Signup
      </button>
    </form>
  );
}
