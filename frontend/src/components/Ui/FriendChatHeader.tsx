import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
interface PropTypes {
  imageUrl: string;
  name: string;
  status: string;
}
const FriendChatHeader: React.FC<PropTypes> = ({ imageUrl, name, status }) => {
  // const isOnline = true;
  return (
    <header className="flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <section className="flex flex-row items-center gap-x-2">
        <img
          src={imageUrl}
          alt="Friend's profile picture"
          className={`size-12 rounded-full bg-cover ring-2 ring-offset-2 ${status === "online" ? "ring-primary" : "ring-background"}`}
        />
        <div>
          <p className="font-semibold capitalize">{name}</p>
          <span className="text-foreground/50 text-xs">
            {/* {isOnline ? "Online" : "Offline"} */}
            {status}
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
