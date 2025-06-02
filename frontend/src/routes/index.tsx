import { createFileRoute, Link } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      <p>Chat application</p>
      {user ? (
        <Link to="/chat" className="btn-fill">
          Continue
        </Link>
      ) : (
        <Link to="/auth/login" className="btn-fill">
          Login / Signup
        </Link>
      )}
    </div>
  );
}
