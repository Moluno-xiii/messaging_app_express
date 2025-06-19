import type { FriendProfile } from "../types";
import Modal from "./Ui/Modal";

interface Props {
  friend: FriendProfile;
  handleFriendProfile: (state: boolean) => void;
}

const FriendProfileModal: React.FC<Props> = ({
  friend,
  handleFriendProfile,
}) => {
  return (
    <Modal
      title={friend.displayName + "'s" + " " + "Profile"}
      handleClose={() => handleFriendProfile(false)}
    >
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex flex-col gap-y-0.5">
          <p className="text-primary text-lg font-semibold">Display Name</p>
          <span>{friend.displayName}</span>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-primary text-lg font-semibold">Email Address</p>
          <span>{friend.email}</span>
        </div>
        <div>
          <p className="text-primary text-lg font-semibold">Profile Picture</p>
          {friend.profilePic ? (
            <img
              src={friend.profilePic}
              alt={`Profile picture for ${friend.displayName}`}
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
