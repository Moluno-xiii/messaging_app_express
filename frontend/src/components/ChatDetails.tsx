import useGetFriendChats from "../hooks/queryHooks/useGetFriendChats";
import Message from "./Message";
import type { Message as MessageTypes } from "../types";
import MessageInput from "./MessageInput";
import ErrorMessage from "./Ui/ErrorMessage";
import FriendChatHeader from "./Ui/FriendChatHeader";
import Loading from "./Ui/Loading";

interface PropTypes {
  selectedFriend: string | undefined;
}

const ChatDetails: React.FC<PropTypes> = ({ selectedFriend }) => {
  const {
    data: messages,
    isPending,
    error,
  } = useGetFriendChats(selectedFriend);

  if (!selectedFriend)
    return (
      <div className="text-primary mx-auto flex max-w-sm min-w-sm items-center justify-center text-center text-xl md:text-2xl">
        Select a chat to view.
      </div>
    );
  if (isPending) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <section className="flex min-w-[408px] flex-1 flex-col gap-y-2">
      <FriendChatHeader status="online" friend={messages.friend} />
      <ul className="scrollbar-none flex flex-1 flex-col gap-y-5 overflow-y-scroll rounded-xl bg-white p-3">
        {messages.data.length > 0 ? (
          messages.data.map((message: MessageTypes) => (
            <Message key={message.id} message={message} />
          ))
        ) : (
          <span className="text-foreground/70 font-montserrat h-full text-center text-lg font-semibold italic">
            This is the beginning of your message history with{" "}
            {messages.friend.displayName}.
          </span>
        )}
      </ul>
      <MessageInput selectedFriend={selectedFriend} />
    </section>
  );
};

export default ChatDetails;
