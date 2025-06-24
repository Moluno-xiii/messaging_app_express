import { useEffect, useState, type SetStateAction } from "react";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import FriendProfileModal from "../FriendProfileModal";
import { BsThreeDots } from "react-icons/bs";

import type { FriendDetails, WsOnlineStatus } from "../../types";
import socket from "../../utils/socket";
interface PropTypes {
  status: string;
  friendDetails: FriendDetails;
}
const FriendChatHeader: React.FC<PropTypes> = ({ friendDetails }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");

  const handleFriendProfile = (state: boolean) => {
    setIsDropDownOpen(false);
    setIsFriendProfileOpen(state);
  };

  useEffect(() => {
    socket.emit("is_online", friendDetails.email);

    const handler = (data: WsOnlineStatus) => {
      console.log("is friend online", data);
      if (data.userStatus !== onlineStatus) {
        setOnlineStatus(data.userStatus);
      }
      return;
    };
    socket.on("is_friend_online", handler);
    return () => {
      socket.off("is_friend_online", handler);
    };
  }, [onlineStatus, friendDetails.email]);

  return (
    <header className="sticky top-0 flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <section className="flex flex-row items-center gap-x-2">
        <img
          onClick={() => handleFriendProfile(true)}
          src={friendDetails.profilePic ?? "default-profile-pic.jpeg"}
          alt="Friend's profile picture"
          className={`size-12 cursor-pointer rounded-full bg-cover ring-2 ring-offset-2 ${onlineStatus === "online" ? "ring-primary" : "ring-background"}`}
          loading="lazy"
        />
        <div>
          <p className="font-semibold">
            {friendDetails.displayName.length > 15
              ? friendDetails.displayName.split("").slice(0, 15).join("") +
                "..."
              : friendDetails.displayName}
          </p>
          <span className="text-foreground/50 text-xs">{onlineStatus}</span>
        </div>
      </section>
      <section className="flex flex-row gap-x-5">
        <div className="flex flex-row items-center gap-x-3 border-r border-r-black pr-5 lg:flex">
          <IoCallOutline className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
          <GoPerson
            onClick={() => handleFriendProfile(true)}
            className="hover:text-primary size-6 cursor-pointer transition-all duration-200"
          />
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <CiSearch className="hover:text-primary size-6 cursor-pointer transition-all duration-200" />
          <BsThreeDots
            onClick={() => setIsDropDownOpen(true)}
            className="hover:text-primary size-6 cursor-pointer transition-all duration-200"
          />
        </div>
      </section>
      {isDropDownOpen ? (
        <DropDown setIsDropDownOpen={setIsDropDownOpen} />
      ) : null}
      {isFriendProfileOpen ? (
        <FriendProfileModal
          friendDetails={friendDetails}
          handleFriendProfile={handleFriendProfile}
        />
      ) : null}
    </header>
  );
};

export default FriendChatHeader;

interface Props {
  setIsDropDownOpen: React.Dispatch<SetStateAction<boolean>>;
}

const DropDown: React.FC<Props> = ({ setIsDropDownOpen }) => {
  return (
    <div className="bg-background absolute right-0 -bottom-5 z-10 flex cursor-pointer flex-col items-start rounded-xl p-2">
      <IoMdClose
        className="hover:text-primary cursor-pointer self-end transition-all duration-200"
        onClick={() => setIsDropDownOpen(false)}
      />
      <span className="text-red-600 transition-all duration-200 hover:text-red-600/70">
        Block user
      </span>
      <span className="text-foreground hover:text-foreground/70 transition-all duration-200">
        Archive user
      </span>
    </div>
  );
};
