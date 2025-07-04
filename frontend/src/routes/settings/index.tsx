import { createFileRoute } from "@tanstack/react-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <div className="">Hello "/settings/"!</div>
    </ProtectedRoute>
  );
}
