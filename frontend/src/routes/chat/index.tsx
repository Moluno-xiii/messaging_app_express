import { createFileRoute } from "@tanstack/react-router";
import ChatDetails from "../../components/ChatDetails";
import Chats from "../../components/Chats";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedFriend, setSelectedFriend] = useState<string | undefined>();
  return (
    <ProtectedRoute>
      <div className="flex h-full flex-row gap-x-4">
        <Chats setSelectedFriend={setSelectedFriend} />
        <ChatDetails selectedFriend={selectedFriend} />
      </div>
    </ProtectedRoute>
  );
}
