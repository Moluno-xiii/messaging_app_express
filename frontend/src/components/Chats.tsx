import { lazy, Suspense, useState } from "react";
import useGetFriends from "../hooks/queryHooks/useGetFriends";
import useSendFriendRequest from "../hooks/queryMutations/useSendFriendRequest";
import useAuth from "../hooks/useAuth";
import type { FriendProfile } from "../utils/friends";
import ChatsHeader from "./Ui/ChatsHeader";
import ErrorMessage from "./Ui/ErrorMessage";
import Loading from "./Ui/Loading";
import AddFriendModal from "./Ui/modals/AddFriendModal";
import type { FriendDetails } from "../types";

const LastMessage = lazy(() => import("../components/LastMessage"));
const ChatDetails = lazy(() => import("../components/ChatDetails"));

const Chats: React.FC = () => {
  const { user } = useAuth();
  const [isAddNewFriendModal, setIsAddNewFriendModal] = useState(false);
  const [friendDetails, setFriendDetails] = useState<FriendDetails | undefined>(
    undefined,
  );

  const handleViewFriend = ({
    email,
    displayName,
    profilePic,
  }: FriendDetails) => {
    setFriendDetails({ email, displayName, profilePic });
  };

  const handleAddFriendModal = (state: boolean) => {
    setIsAddNewFriendModal(state);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as { friendEmail: string };
    if (data.friendEmail.trim().length < 1) return;
    addFriendMutation.mutate(data);
    form.reset();
  };

  const addFriendMutation = useSendFriendRequest(handleAddFriendModal);
  const { isPending, error, data: friends } = useGetFriends();

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="flex h-full w-full flex-row gap-x-4">
      <section className="scrollbar-none flex h-full max-w-[390px] min-w-sm flex-col gap-y-2 overflow-y-scroll">
        <ChatsHeader handleModal={handleAddFriendModal} />
        <ul className="scrollbar-none bg-base flex h-full flex-1 flex-col overflow-y-scroll rounded-xl p-4">
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
                  handleViewFriend({
                    email: friend.ProfileEmail[0].email,
                    profilePic: friend.ProfileEmail[0].profilePic,
                    displayName: friend.ProfileEmail[0].displayName,
                  })
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
                  <Suspense
                    fallback={<span className="italic">Loading...</span>}
                  >
                    <LastMessage friendEmail={friend.ProfileEmail[0].email} />
                  </Suspense>
                </div>
              </li>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-y-3 text-center text-xl">
              <span className="text-foreground font-semibold">
                You haven't added any friends yet, Friends added will appear
                here.
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

      <section className="scrollbar-none h-full w-full overflow-y-scroll">
        {friendDetails ? (
          <Suspense fallback={<Loading />}>
            <ChatDetails friendDetails={friendDetails} />
          </Suspense>
        ) : (
          <div className="text-primary mx-auto flex h-full max-w-sm min-w-sm items-center justify-center text-center text-xl md:text-2xl">
            Select a chat to view.
          </div>
        )}
      </section>
    </div>
  );
};

export default Chats;

// const PinnedChats = () => {};
