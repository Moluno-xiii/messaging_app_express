import Modal from "../Modal";

interface Props {
  handleModal: (state: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isPending: boolean;
}

const AddFriendModal: React.FC<Props> = ({
  handleSubmit,
  handleModal,
  isPending,
}) => {
  return (
    <Modal title="Add new Friend" handleClose={() => handleModal(false)}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-5">
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
          {isPending ? "Sending Friend request..." : "Send friend request"}
        </button>
      </form>
    </Modal>
  );
};

export default AddFriendModal;
