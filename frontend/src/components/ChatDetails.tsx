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
    <section className="flex min-h-full w-full min-w-[408px] flex-1 flex-col gap-y-2">
      <FriendChatHeader status="online" friendDetails={friendDetails} />
      <div className="flex min-h-full flex-1">
        <Suspense
          fallback={
            <span className="flex min-h-full w-full flex-col items-center justify-center italic">
              Loading conversations...
            </span>
          }
        >
          <FriendsMessages friendDetails={friendDetails} />
        </Suspense>
      </div>
      <MessageInput selectedFriend={friendDetails.email} />
    </section>
  );
};

export default ChatDetails;
