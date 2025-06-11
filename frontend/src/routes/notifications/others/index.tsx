import { createFileRoute } from "@tanstack/react-router";
import ErrorMessage from "../../../components/Ui/ErrorMessage";
import Loading from "../../../components/Ui/Loading";
import useGetNotifications from "../../../hooks/queryHooks/useGetNotifications";
import type { Notification } from "../../../types";

export const Route = createFileRoute("/notifications/others/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: notifications, error, isLoading } = useGetNotifications();

  if (error) return <ErrorMessage message={error.message} />;
  if (isLoading) return <Loading />;

  return (
    <div className="h-full w-full">
      <ul className="h-full w-full">
        {notifications.length > 0 ? (
          notifications.data.map((notification: Notification) => (
            <li key={notification.id}>
              <p className="text-xl">{notification.title}</p>
              <p>{notification.message}</p>
            </li>
          ))
        ) : (
          <div className="text-primary mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center text-center text-xl">
            No notifications yet, notifications you receive will appear here.
          </div>
        )}
      </ul>
    </div>
  );
}
