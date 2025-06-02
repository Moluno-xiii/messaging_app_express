import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Modal from "./Modal";
import { addFriend } from "../../utils/friends";
import toast from "react-hot-toast";

const ChatsHeader: React.FC = () => {
  const [isAddNewFriendModal, setIsAddNewFriendModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as { friendEmail: string };
    console.log(data);
    if (data.friendEmail.trim().length < 1) return;
    console.log("I successfully submitted");
    const { message, success } = await addFriend(data);
    if (!success) {
      toast.error(message ?? "unexpected error");
      return;
    }
    toast.success(message ?? "Request sent successfully!");
    setIsAddNewFriendModal(false);
    form.reset();
  };
  return (
    <header className="flex flex-row items-center justify-between gap-4 rounded-xl bg-white p-4">
      <span className="text-2xl font-bold">Chats</span>
      <input
        type="text"
        placeholder="Search"
        className="border-foreground/20 focus:border-foreground rounded-3xl border px-3 py-2 transition-all duration-200 outline-none"
      />
      <div className="bg-primary hover:bg-primary/60 text-background cursor-pointer rounded-full p-3 transition-all duration-200">
        <IoAdd size={22} onClick={() => setIsAddNewFriendModal(true)} />
      </div>
      {isAddNewFriendModal ? (
        <Modal
          title="Add new Friend"
          handleClose={() => setIsAddNewFriendModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-y-5"
          >
            <div className="flex flex-col gap-y-2">
              <label className="font-semibold" htmlFor="friendEmail">
                Enter friend's email address
              </label>
              <input
                className="border-secondary focus:border-primary rounded-md border p-2 transition-all duration-200 outline-none"
                type="email"
                required
                name="friendEmail"
              />
            </div>
            <button className="btn-fill" type="submit">
              Send friend request
            </button>
          </form>
        </Modal>
      ) : null}
    </header>
  );
};

export default ChatsHeader;
