import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export const Route = createFileRoute("/notifications")({
  component: RouteComponent,
});

const notificationLinks = [
  {
    name: "Friend requests",
    route: "/notifications/friend-requests",
    type: "sent",
  },
  {
    name: "Others",
    route: "/notifications/others",
  },
];

function RouteComponent() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  useEffect(() => {
    if (routerState.location.pathname === "/notifications") {
      navigate({
        to: "/notifications/friend-requests",
        search: { type: "sent" },
        replace: true,
      });
    }
  }, [routerState.location.pathname, navigate]);
  return (
    <ProtectedRoute>
      <div className="flex h-full w-full flex-col gap-y-5">
        <ul className="flex flex-row items-center gap-x-4">
          {notificationLinks.map((link) => (
            <li key={link.route}>
              <Link
                className="[&.active]:text-primary hover:text-primary transition-all duration-300 [&.active]:underline"
                to={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
