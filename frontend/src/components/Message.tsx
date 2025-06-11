import useAuth from "../hooks/useAuth";
import type { Message as MessageTypes } from "../types";
import { ISOToString } from "../utils/helpers";

const Message = ({ message }: { message: MessageTypes }) => {
  const { user } = useAuth();
  return (
    <li key={message.id} className="flex flex-col">
      {message.sender_id === user?.email ? (
        <div className="flex max-w-xs flex-col gap-y-2 self-end lg:max-w-md xl:max-w-xl 2xl:max-w-3xl">
          <span className="bg-primary self-end rounded-t-xl rounded-l-xl p-2 whitespace-pre-line text-white">
            {message.messge}
          </span>
          <span className="self-end text-sm">
            {ISOToString(message.date_created).split(",")}
          </span>
        </div>
      ) : (
        <div className="flex max-w-xs flex-col gap-y-2 lg:max-w-lg xl:max-w-xl 2xl:max-w-3xl">
          <span className="text-foreground bg-foreground/20 self-start rounded-t-xl rounded-r-xl p-2 whitespace-pre-line">
            {message.messge}
          </span>
          <span className="text-sm">
            {ISOToString(message.date_created).split(",")}
          </span>
        </div>
      )}
    </li>
  );
};

export default Message;
