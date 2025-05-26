import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";

const FriendChatHeader: React.FC = () => {
  const isOnline = true;
  return (
    <header className="flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <section className="flex flex-row items-center gap-x-2">
        <img
          src="/profile-pic.jpeg"
          alt="Friend's profile picture"
          className={`size-12 rounded-full ring-2 ring-offset-2 ${isOnline ? "ring-primary" : "ring-background"}`}
        />
        <div>
          <p className="font-semibold capitalize">Clinton Felix</p>
          <span className="text-foreground/50 text-xs">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </section>
      <section className="flex flex-row gap-x-5">
        <div className="flex flex-row items-center gap-x-3 border-r border-r-black pr-5 lg:flex">
          <IoCallOutline className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
          <GoPerson className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <CiSearch className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
          <PiDotsThreeBold className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
        </div>
      </section>
    </header>
  );
};

export default FriendChatHeader;
