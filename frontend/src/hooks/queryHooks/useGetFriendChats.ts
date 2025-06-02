import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../utils/messages";

const useGetFriendChats = (selectedFriend: string | undefined) => {
  return useQuery({
    queryKey: ["messages", selectedFriend],
    queryFn: async () => {
      if (!selectedFriend) return;
      return await getMessages(selectedFriend);
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export default useGetFriendChats;
