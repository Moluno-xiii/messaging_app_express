import Modal from "./Ui/Modal";

interface Props {
  friendDetails: {
    displayName: string;
    profilePic: string | null;
    email: string;
  };
  handleFriendProfile: (state: boolean) => void;
}

const FriendProfileModal: React.FC<Props> = ({
  friendDetails,
  handleFriendProfile,
}) => {
  return (
    <Modal
      title={friendDetails.displayName + "'s" + " " + "Profile"}
      handleClose={() => handleFriendProfile(false)}
    >
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex flex-col gap-y-0.5">
          <p className="text-primary text-lg font-semibold">Display Name</p>
          <span>{friendDetails.displayName}</span>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-primary text-lg font-semibold">Email Address</p>
          <span>{friendDetails.email}</span>
        </div>
        <div>
          <p className="text-primary text-lg font-semibold">Profile Picture</p>
          {friendDetails.profilePic ? (
            <img
              src={friendDetails.profilePic}
              alt={`Profile picture for ${friendDetails.displayName}`}
              className=""
              loading="lazy"
            />
          ) : (
            <span>Not Set</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FriendProfileModal;
