import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { respondToFriendRequest } from "../../utils/friends";
import type { FriendRequestStatus, FriendRequestType } from "../../types";

const useHandleFriendRequest = (
  request: FriendRequestType,
  requestStatus: FriendRequestStatus,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await respondToFriendRequest(
        requestId,
        request.requesterEmail,
        request.requestedToEmail,
        requestStatus,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "received"],
      });
      toast.success(`Request ${requestStatus.toLowerCase()} successfully!`);
    },
    onError: (err) => {
      toast.error(err.message ?? "An error occured, try again");
    },
  });
};

export default useHandleFriendRequest;
