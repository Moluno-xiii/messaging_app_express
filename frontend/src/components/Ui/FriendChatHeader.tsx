import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
import Modal from "./Modal";
interface PropTypes {
  status: string;
  friend: {
    displayName: string;
    email: string;
    id: string;
    profilePic: string | null;
  };
}
const FriendChatHeader: React.FC<PropTypes> = ({ friend, status }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);

  const handleFriendProfile = (state: boolean) => {
    setIsDropDownOpen(false);
    setIsFriendProfileOpen(state);
  };
  // const isOnline = true;
  return (
    <header className="relative flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <section className="flex flex-row items-center gap-x-2">
        <img
          onClick={() => handleFriendProfile(true)}
          src={friend.profilePic ?? "default-profile-pic.jpeg"}
          alt="Friend's profile picture"
          className={`size-12 cursor-pointer rounded-full bg-cover ring-2 ring-offset-2 ${status === "online" ? "ring-primary" : "ring-background"}`}
        />
        <div>
          <p className="font-semibold">
            {friend.displayName.length > 15
              ? friend.displayName.split("").slice(0, 15).join("") + "..."
              : friend.displayName}
          </p>
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
          <PiDotsThreeBold
            onClick={() => setIsDropDownOpen(true)}
            className="hover:text-primary size-6 cursor-pointer transition-all duration-200"
          />
        </div>
      </section>
      {isDropDownOpen ? (
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
          <span onClick={() => handleFriendProfile(true)}>View Profile</span>
        </div>
      ) : null}
      {isFriendProfileOpen ? (
        <Modal
          title={friend.displayName + "'s" + " " + "Profile"}
          handleClose={() => handleFriendProfile(false)}
        >
          <div className="flex w-full flex-col gap-y-2">
            <div className="flex flex-col gap-y-0.5">
              <p className="text-lg font-semibold">Display Name</p>
              <span>{friend.displayName}</span>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-lg font-semibold">Email Address</p>
              <span>{friend.email}</span>
            </div>
            <div>
              <p className="text-lg font-semibold">Profile Picture</p>
              {friend.profilePic ? (
                <img
                  src={friend.profilePic}
                  alt={`Profile picture for ${friend.displayName}`}
                  className=""
                />
              ) : (
                <span>Not Set</span>
              )}
            </div>
          </div>
        </Modal>
      ) : null}
    </header>
  );
};

export default FriendChatHeader;
