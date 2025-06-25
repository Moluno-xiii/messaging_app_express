import React, { lazy, Suspense } from "react";
import type { FriendDetails } from "../types";
import MessageInput from "./MessageInput";
import FriendChatHeader from "./Ui/FriendChatHeader";

const FriendsMessages = lazy(() => import("./FriendsMessages"));
interface PropTypes {
  friendDetails: FriendDetails;
}

const ChatDetails: React.FC<PropTypes> = ({ friendDetails }) => {
  return (
    <section className="scrollbar-none relative flex max-h-[calc(100dvh-50px)] min-h-[calc(100dvh-50px)] min-w-[408px] flex-col gap-y-3 overflow-y-scroll">
      <FriendChatHeader friendDetails={friendDetails} />
      <Suspense
        fallback={
          <span className="flex min-h-full w-full flex-col items-center justify-center italic">
            Loading conversations...
          </span>
        }
      >
        <FriendsMessages friendDetails={friendDetails} />
      </Suspense>

      <MessageInput selectedFriend={friendDetails.email} />
    </section>
  );
};

export default ChatDetails;
