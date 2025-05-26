import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      <div className="flex flex-row items-center gap-x-3">
        <Link
          to="/auth/login"
          className="[&.active]:text-primary [&.active]:font-bold [&.active]:underline"
        >
          Login
        </Link>
        <Link
          to="/auth/signup"
          className="[&.active]:text-primary [&.active]:font-bold [&.active]:underline"
        >
          Signup
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
