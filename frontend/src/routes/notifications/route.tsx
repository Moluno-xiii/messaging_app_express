import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import useGetFriendRequests from "../../hooks/queryHooks/useGetFriendRequests";
import useGetNotifications from "../../hooks/queryHooks/useGetNotifications";
import Loading from "../../components/Ui/Loading";
import NotificationIndicator from "../../components/Ui/NotificationIndicator";

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
  const { data: requests, isPending } = useGetFriendRequests("received");
  const { data: notis, isPending: isLoadingNotis } =
    useGetNotifications("unread");
  useEffect(() => {
    if (
      routerState.location.pathname === "/notifications" ||
      routerState.location.pathname === "/notifications/"
    ) {
      navigate({
        to: "/notifications/friend-requests",
        search: { type: "sent" },
        replace: true,
      });
    }
  }, [routerState.location.pathname, navigate]);

  if (isPending || isLoadingNotis) return <Loading />;
  return (
    <ProtectedRoute>
      <div className="flex h-full w-full flex-col gap-y-5">
        <ul className="flex flex-row items-center gap-x-4">
          {notificationLinks.map((link) => (
            <li key={link.route} className="relative">
              <Link
                className="[&.active]:text-primary hover:text-primary transition-all duration-300 [&.active]:underline"
                to={link.route}
              >
                {link.name}
              </Link>
              {link.route === "/notifications/others" && notis.length > 0 && (
                <NotificationIndicator />
              )}
              {link.route === "/notifications/friend-requests" &&
                requests.length > 0 && <NotificationIndicator />}
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
