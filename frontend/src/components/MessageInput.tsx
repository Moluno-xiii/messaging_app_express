import { FiSend } from "react-icons/fi";
import useSendMessage from "../hooks/queryMutations/useSendMessage";
import socket from "../utils/socket";

const MessageInput = ({ selectedFriend }: { selectedFriend: string }) => {
  const sendMessageMutation = useSendMessage(selectedFriend);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    socket.emit("is_typing", { selectedFriend, status: false });
    const data = Object.fromEntries(formData) as { message: string };
    if (data.message.trim().length < 1) return;
    sendMessageMutation.mutate(data.message);
    event.currentTarget.reset();
  };

  return (
    <form
      onClick={handleSubmit}
      className="sticky bottom-0 flex flex-row items-center gap-x-2 rounded-xl bg-white p-2"
    >
      <textarea
        placeholder="Write message..."
        name="message"
        className="flex-1 resize-none p-2 outline-none"
        rows={1}
        autoComplete="off"
        onInput={(e) => {
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = `${Math.min(target.scrollHeight, 400)}px`;
          socket.emit("is_typing", { selectedFriend, status: true });
        }}
      />
      <button
        aria-label="send message button"
        className="bg-primary hover:bg-primary/70 cursor-pointer self-end rounded-xl p-2 text-white transition-all duration-200"
        type="submit"
      >
        <FiSend size={22} />
      </button>
    </form>
  );
};

export default MessageInput;
