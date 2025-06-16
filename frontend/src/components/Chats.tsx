import { useState, type SetStateAction } from "react";
import useGetFriends from "../hooks/queryHooks/useGetFriends";
import useSendFriendRequest from "../hooks/queryMutations/useSendFriendRequest";
import useAuth from "../hooks/useAuth";
import type { FriendProfile } from "../utils/friends";
import ChatsHeader from "./Ui/ChatsHeader";
import ErrorMessage from "./Ui/ErrorMessage";
import Loading from "./Ui/Loading";
import AddFriendModal from "./Ui/modals/AddFriendModal";

interface PropTypes {
  setSelectedFriend: React.Dispatch<SetStateAction<string | undefined>>;
}

const Chats: React.FC<PropTypes> = ({ setSelectedFriend }) => {
  const { user } = useAuth();
  const [isAddNewFriendModal, setIsAddNewFriendModal] = useState(false);

  const handleAddFriendModal = (state: boolean) => {
    setIsAddNewFriendModal(state);
  };

  const addFriendMutation = useSendFriendRequest(handleAddFriendModal);
  const { isPending, error, data: friends } = useGetFriends();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as { friendEmail: string };
    if (data.friendEmail.trim().length < 1) return;
    addFriendMutation.mutate(data);
    form.reset();
  };

  const chat = {
    name: "chat name",
    time: "5:00 PM",
    numberOfUnreadMessages: 3,
    message:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore cupiditate minus quibusdam, laudantium dolorem numquam atque sed, consectetur accusantium quam sequi cum, unde rerum excepturi nemo velit eveniet maiores! Optio voluptatem officiis hic similique temporibus ratione nemo nostrum. Necessitatibus sit odit quas perspiciatis fuga suscipit nulla modi debitis maiores consectetur.",
  };

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <section className="scrollbar-none flex h-full max-w-[390px] min-w-sm flex-col gap-y-2 overflow-y-scroll">
      <ChatsHeader handleModal={handleAddFriendModal} />
      <ul className="scrollbar-none flex h-full flex-1 flex-col overflow-y-scroll rounded-xl bg-white p-4">
        <div className="text-primary flex flex-row items-center justify-between">
          <span className="uppercase">All friends</span>
          <span className="">{user?.displayName ?? user?.email}</span>
        </div>

        {friends && friends.length > 0 ? (
          friends.map((friend: FriendProfile) => (
            <li
              key={friend.ProfileEmail[0].id}
              className="border-b-foreground/20 hover:bg-primary/5 flex cursor-pointer flex-row items-center justify-between gap-3 border-b py-3 transition-all duration-200"
              onClick={() =>
                setSelectedFriend(
                  // friend.userEmail === user?.email
                  //   ? friend.friendEmail
                  //   : friend.userEmail,
                  friend.ProfileEmail[0].email,
                )
              }
            >
              <img
                src={
                  friend.ProfileEmail[0].profilePic ??
                  "default-profile-pic.jpeg"
                }
                className="size-14 rounded-full"
                alt="Profile picture"
              />
              <div className="gap-y- flex flex-1 flex-col">
                <p className="text-lg font-semibold first-letter:capitalize">
                  {friend.ProfileEmail[0].displayName.length > 18
                    ? friend.ProfileEmail[0].displayName
                        .split("")
                        .slice(0, 18)
                        .join("") + "..."
                    : friend.ProfileEmail[0].displayName}
                </p>
                <span className="text-foreground/70 text-sm">
                  {chat.message.length > 60
                    ? chat.message.split("").slice(0, 30).join("") + "..."
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
              </div>
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
            <button
              onClick={() => setIsAddNewFriendModal(true)}
              className="btn-fill"
            >
              Add friends
            </button>
          </div>
        )}
      </ul>
      {isAddNewFriendModal ? (
        <AddFriendModal
          handleSubmit={handleSubmit}
          handleModal={handleAddFriendModal}
          isPending={addFriendMutation.isPending}
        />
      ) : null}
    </section>
  );
};

export default Chats;

// const PinnedChats = () => {};
