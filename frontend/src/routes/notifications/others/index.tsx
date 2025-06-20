import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import Loading from "../../../components/Ui/Loading";
const OtherNotifications = lazy(
  () => import("../../../components/OtherNotifications"),
);

export const Route = createFileRoute("/notifications/others/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full w-full">
      <Suspense fallback={<Loading />}>
        <OtherNotifications />
      </Suspense>
    </div>
  );
}
