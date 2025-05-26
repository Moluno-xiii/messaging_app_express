import { IoAdd } from "react-icons/io5";

const ChatsHeader: React.FC = () => {
  return (
    <header className="flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <span className="text-2xl font-bold">Chats</span>
      <input
        type="text"
        placeholder="Search"
        className="border-foreground/20 focus:border-foreground rounded-3xl border px-3 py-2 transition-all duration-200 outline-none"
      />
      <div className="bg-primary hover:bg-primary/60 text-background cursor-pointer rounded-full p-3 transition-all duration-200">
        <IoAdd size={22} />
      </div>
    </header>
  );
};

export default ChatsHeader;
