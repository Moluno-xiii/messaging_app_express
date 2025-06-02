import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const FriendRequests = lazy(() => import("../../../components/FriendRequests"));

export const Route = createFileRoute("/notifications/friend-requests/")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      type: (search.type as "sent" | "received") || "received",
    };
  },
});

function RouteComponent() {
  const { type } = useSearch({ from: Route.id });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Link
          className="btn-param"
          to="/notifications/friend-requests"
          search={{ type: "sent" }}
        >
          Sent requests
        </Link>
        <Link
          className="btn-param"
          to="/notifications/friend-requests"
          search={{ type: "received" }}
        >
          Received requests
        </Link>
      </div>

      <Suspense fallback={<div>Loading {type} requests...</div>}>
        <FriendRequests type={type} />
      </Suspense>
    </div>
  );
}
