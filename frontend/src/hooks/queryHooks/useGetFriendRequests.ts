import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../../utils/friends";

const useGetFriendRequests = (type: "sent" | "received") => {
  return useQuery({
    queryFn: async () => await getFriendRequests(type),
    queryKey: ["friendRequests", type],
    select: (res) => res.requests,
    staleTime: Infinity,
  });
};

export default useGetFriendRequests;
