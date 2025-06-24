import useGetFriendChats from "../hooks/queryHooks/useGetFriendChats";
import type { FriendDetails, Message as MessageTypes } from "../types";
import Message from "./Message";
import ErrorMessage from "./Ui/ErrorMessage";
interface Props {
  friendDetails: FriendDetails;
}
const FriendsMessages: React.FC<Props> = ({ friendDetails }) => {
  const { data: messages, error } = useGetFriendChats(friendDetails.email);
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <div className="flex-1">
      <ul className="scrollbar-none flex h-full flex-1 flex-col gap-y-5 overflow-y-scroll rounded-xl bg-white p-3">
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
      </ul>
    </div>
  );
};

export default FriendsMessages;
