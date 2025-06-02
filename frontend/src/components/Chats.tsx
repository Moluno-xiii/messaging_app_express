import type { SetStateAction } from "react";
import useGetFriends from "../hooks/queryHooks/useGetFriends";
import useAuth from "../hooks/useAuth";
import type { Friend } from "../types";
import ChatsHeader from "./Ui/ChatsHeader";
import ErrorMessage from "./Ui/ErrorMessage";
import Loading from "./Ui/Loading";

interface PropTypes {
  setSelectedFriend: React.Dispatch<SetStateAction<string | undefined>>;
}

const Chats: React.FC<PropTypes> = ({ setSelectedFriend }) => {
  const { user } = useAuth();
  const { isPending, error, data: friends } = useGetFriends();

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  console.log("User friends data", friends);
  return (
    <section className="scrollbar-none flex h-full max-w-[390px] flex-col gap-y-2 overflow-y-scroll">
      <ChatsHeader />
      <ul className="scrollbar-none flex h-full flex-1 flex-col overflow-y-scroll rounded-xl bg-white p-4">
        <div className="text-primary flex flex-row items-center justify-between">
          <span className="uppercase">All friends</span>
          <span className="">{user?.email}</span>
        </div>
        {friends.data.length > 0 ? (
          friends.data.map((friend: Friend) => (
            <li
              key={friend.id}
              className="border-b-foreground/20 hover:bg-primary/5 flex cursor-pointer flex-row items-center justify-between gap-3 border-b py-3 transition-all duration-200"
              onClick={() =>
                setSelectedFriend(
                  friend.userEmail === user?.email
                    ? friend.friendEmail
                    : friend.userEmail,
                )
              }
            >
              {/* <img
                src={chat.userImage}
                className="size-14 rounded-full"
                alt="Profile picture"
              />
              <div className="gap-y- flex flex-1 flex-col">
                <p className="text-lg font-semibold capitalize">{chat.name}</p>
                <span className="text-foreground/70 text-sm">
                  {chat.message.length > 60
                    ? chat.message.split("").slice(0, 63).join("") + "..."
                    : chat.message}
                </span>
              </div>
              <div className="flex flex-col items-center gap-y-1">
                <span className="text-sm">{chat.time}</span>
                {chat.numberOfUnreadMessages > 0 ? (
                  <p className="text-background bg-primary size-6 rounded-full text-center">
                    {chat.numberOfUnreadMessages}
                  </p>
                ) : (
                  ""
                )}
              </div> */}
              <p>
                {friend.friendEmail === user?.email
                  ? friend.userEmail
                  : friend.friendEmail}
              </p>
            </li>
            // <li
            //   key={chat.id}
            //   className="border-b-foreground/20 hover:bg-primary/5 flex cursor-default flex-row items-center justify-between gap-3 border-b py-3 transition-all duration-200"
            // >
            //   <img
            //     src={chat.userImage}
            //     className="size-14 rounded-full"
            //     alt="Profile picture"
            //   />
            //   <div className="gap-y- flex flex-1 flex-col">
            //     <p className="text-lg font-semibold capitalize">{chat.name}</p>
            //     <span className="text-foreground/70 text-sm">
            //       {chat.message.length > 60
            //         ? chat.message.split("").slice(0, 63).join("") + "..."
            //         : chat.message}
            //     </span>
            //   </div>
            //   <div className="flex flex-col items-center gap-y-1">
            //     <span className="text-sm">{chat.time}</span>
            //     {chat.numberOfUnreadMessages > 0 ? (
            //       <p className="text-background bg-primary size-6 rounded-full text-center">
            //         {chat.numberOfUnreadMessages}
            //       </p>
            //     ) : (
            //       ""
            //     )}
            //   </div>
            // </li>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-y-3 text-center text-xl">
            <span className="text-foreground font-semibold">
              You haven't added any friends yet, Friends added will appear here.
            </span>
            <button className="btn-fill">Add friends</button>
          </div>
        )}
      </ul>
    </section>
  );
};

export default Chats;

// const PinnedChats = () => {};
