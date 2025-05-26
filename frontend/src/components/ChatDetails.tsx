import { FiSend } from "react-icons/fi";
import FriendChatHeader from "./Ui/FriendChatHeader";
import type { Message } from "../types";
import { messages } from "../data";

const ChatDetails: React.FC = () => {
  return (
    <section className="flex min-w-[408px] flex-1 flex-col gap-y-2">
      <FriendChatHeader />
      <ul className="scrollbar-none flex flex-1 flex-col gap-y-5 overflow-y-scroll rounded-xl bg-white p-3">
        {messages.length > 0 ? (
          messages.map((message: Message) => (
            <li key={message.id} className="flex flex-col">
              {message.senderId === "myId" ? (
                <div className="flex max-w-xs flex-col gap-y-2 self-end lg:max-w-md xl:max-w-xl 2xl:max-w-3xl">
                  <span className="bg-primary self-end rounded-t-xl rounded-l-xl p-2 text-white">
                    {message.body}
                  </span>
                  <span className="text-sm">{message.timeSent}</span>
                </div>
              ) : (
                <div className="flex max-w-xs flex-col gap-y-2 lg:max-w-lg xl:max-w-xl 2xl:max-w-3xl">
                  <span className="text-foreground bg-foreground/20 self-start rounded-t-xl rounded-r-xl p-2">
                    {message.body}
                  </span>
                  <span className="text-sm">{message.timeSent}</span>
                </div>
              )}
            </li>
          ))
        ) : (
          <span className="text-foreground/50 h-full text-center text-xl font-semibold">
            This is the beginning of your message history with "User's name".
          </span>
        )}
      </ul>
      <section className="flex flex-row items-center gap-x-2 rounded-xl bg-white p-2">
        <textarea
          placeholder="Write message..."
          className="flex-1 resize-none p-2 outline-none"
          rows={1}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 400)}px`;
          }}
        />
        <button
          aria-label="send message button"
          className="bg-primary self-end rounded-xl p-2 text-white"
        >
          <FiSend size={22} />
        </button>
      </section>
    </section>
  );
};

export default ChatDetails;
