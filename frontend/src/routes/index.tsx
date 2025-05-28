import { createFileRoute } from "@tanstack/react-router";
import ChatDetails from "../components/ChatDetails";
import Chats from "../components/Chats";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    try {
      const query = await fetch("http://localhost:7002", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });
      return await query.json();
    } catch (err) {
      console.error(err);
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-row gap-x-4">
      <Chats />
      <ChatDetails />
    </div>
  );
}
