import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteFriendRequest } from "../../utils/friends";

const useDeleteFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      await deleteFriendRequest(requestId);
    },
    onSuccess: () => {
      toast.success("Request deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent"],
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "An error occured, try again");
    },
  });
};

export default useDeleteFriendRequest;
