import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../utils/profile";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      profilePic,
      displayName,
    }: {
      profilePic?: string;
      displayName?: string;
    }) => {
      await updateUserProfile(profilePic, displayName);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useUpdateUserProfile;
