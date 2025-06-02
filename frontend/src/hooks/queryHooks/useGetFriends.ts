import { useQuery } from "@tanstack/react-query";
import { fetchUserFriends } from "../../utils/friends";

const useGetFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => await fetchUserFriends(),
    staleTime: 0,
  });
};

export default useGetFriends;
