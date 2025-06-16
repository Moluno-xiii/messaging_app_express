import { useQuery } from "@tanstack/react-query";
import { fetchUserFriends } from "../../utils/friends";

const useGetFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => await fetchUserFriends(),
    select: (res) => res.data,
    staleTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export default useGetFriends;
