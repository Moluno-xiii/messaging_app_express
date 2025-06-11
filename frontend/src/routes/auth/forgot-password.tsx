import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../../utils/auth";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      setIsPending(true);
      const { message, success } = await forgotPassword(data.email as string);

      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);
    } catch (error: unknown) {
      toast.error("An error occured, try again.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <label htmlFor="email">Enter your Email</label>
        <input
          required
          type="email"
          className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none max-sm:w-xs md:min-w-sm"
          name="email"
          placeholder="$your_email@gmail.com"
        />
      </div>
      <button disabled={isPending} type="submit" className="btn-fill">
        {isPending ? "Submitting..." : " Submit"}
      </button>
    </form>
  );
}
