import { createFileRoute } from "@tanstack/react-router";
import Chats from "../../components/Chats";
import ProtectedRoute from "../../components/ProtectedRoute";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <Chats />
    </ProtectedRoute>
  );
}
