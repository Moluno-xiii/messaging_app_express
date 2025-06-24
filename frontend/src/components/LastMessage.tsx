import { useEffect, useState } from "react";
import useGetLastMessage from "../hooks/queryHooks/useGetLastMessage";
import { ISOToString } from "../utils/helpers";
import socket from "../utils/socket";
import ErrorMessage from "./Ui/ErrorMessage";

interface Props {
  friendEmail: string;
}
const LastMessage: React.FC<Props> = ({ friendEmail }) => {
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { error, data } = useGetLastMessage(friendEmail);

  useEffect(() => {
    const handler = (data: { selectedFriend: string; status: boolean }) => {
      if (data.status !== isUserTyping) {
        setIsUserTyping(data.status);
      }
    };

    socket.on("is_user_typing", handler);
    return () => {
      socket.off("is_user_typing", handler);
    };
  }, [isUserTyping]);

  if (error) return <ErrorMessage message={error.message} />;
  if (!data)
    return (
      <span className="text-foreground/50 text-sm italic">
        No chats with this user yet...
      </span>
    );
  return (
    <div className="text-foreground/70 flex flex-row items-center justify-between text-sm">
      {isUserTyping ? (
        <span className="text-primary italic">Typing... </span>
      ) : (
        <span className="">
          {data.mesasge.length > 34
            ? data.mesasge.split("").slice(0, 34).join("") + "..."
            : data.mesasge}
        </span>
      )}
      <span className="">{ISOToString(data.date_created).split(",")[3]}</span>
    </div>
  );
};

export default LastMessage;
