import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import useAuth from "../../hooks/useAuth";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const routerState = useRouterState();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      routerState.location.pathname === "/auth" ||
      routerState.location.pathname === "/auth/"
    ) {
      navigate({
        to: "/auth/signup",
        replace: true,
      });
    }
  }, [routerState.location.pathname, navigate]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 md:gap-y-7">
      <div className="flex flex-row items-center gap-x-3">
        <Link
          to="/auth/login"
          className="[&.active]:text-primary hover:text-primary/60 text-xl transition-all duration-200 [&.active]:font-bold [&.active]:underline"
        >
          Login
        </Link>
        <Link
          to="/auth/signup"
          className="[&.active]:text-primary hover:text-primary/60 text-xl transition-all duration-200 [&.active]:font-bold [&.active]:underline"
        >
          Signup
        </Link>
      </div>
      <Outlet />

      {user ? (
        <div className="flex flex-col gap-y-2">
          <span className="italic">Welcome back, {user.email}</span>
          <Link
            to="/chat"
            className="bg-primary hover:bg-primary/70 flex flex-row items-center justify-between p-2 text-white transition-all duration-300"
          >
            Continue
            <FaArrowRightLong />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
