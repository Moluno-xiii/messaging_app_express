import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addFriend } from "../../utils/friends";

const useSendFriendRequest = (handleModal: (state: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { friendEmail: string }) => {
      const { message, success } = await addFriend(data);
      if (!success) {
        throw new Error(message ?? "unexpected error");
      }
      toast.success(message ?? "Request sent successfully!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent"],
      });
      handleModal(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useSendFriendRequest;
