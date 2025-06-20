import useGetNotifications from "../hooks/queryHooks/useGetNotifications";
import useSocket from "../hooks/useSocket";
import type { Notification } from "../types";

const OtherNotifications = () => {
  const { data: notifications } = useGetNotifications("all");
  const { readNotification } = useSocket();

  console.log("I received notifications ,", notifications);
  return (
    <ul className="h-full w-full">
      {notifications.length > 0 ? (
        notifications.map((notification: Notification) => (
          <li key={notification.id}>
            <p className="text-xl">{notification.title}</p>
            <p>{notification.message}</p>
            <button
              className="btn-error"
              onClick={() => readNotification(notification.id)}
            >
              test button
            </button>
          </li>
        ))
      ) : (
        <div className="text-primary mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center text-center text-xl">
          No notifications yet, notifications you receive will appear here.
        </div>
      )}
    </ul>
  );
};

export default OtherNotifications;
