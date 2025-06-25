import { useRef } from "react";
import useGetFriendChats from "../hooks/queryHooks/useGetFriendChats";
import type { FriendDetails, Message as MessageTypes } from "../types";
import Message from "./Message";
import ErrorMessage from "./Ui/ErrorMessage";
import { FaAnglesDown } from "react-icons/fa6";
interface Props {
  friendDetails: FriendDetails;
}
const FriendsMessages: React.FC<Props> = ({ friendDetails }) => {
  const { data: messages, error } = useGetFriendChats(friendDetails.email);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  if (error) return <ErrorMessage message={error.message} />;

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <ul className="scrollbar-none bg-base flex min-h-full flex-1 flex-col overflow-y-scroll rounded-xl p-3">
      {messages.data.length > 0 ? (
        messages.data.map((message: MessageTypes) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <span className="text-foreground/70 font-montserrat h-full text-center text-lg font-semibold italic">
          This is the beginning of your message history with{" "}
          {friendDetails.displayName}.
        </span>
      )}
      <button className="bg-foreground absolute bottom-20 left-2 flex size-10 cursor-pointer items-center justify-center rounded-full p-3 text-center">
        <FaAnglesDown onClick={scrollToBottom} className="text-white" />
      </button>
      <div className="" ref={messagesEndRef} />
    </ul>
  );
};

export default FriendsMessages;
