import { createFileRoute } from "@tanstack/react-router";
import ChatDetails from "../components/ChatDetails";
import Chats from "../components/Chats";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-row gap-x-4">
      <Chats />
      <ChatDetails />
    </div>
  );
}
