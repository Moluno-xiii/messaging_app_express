import { useSuspenseQuery } from "@tanstack/react-query";
import { getMessages } from "../../utils/messages";

const useGetFriendChats = (selectedFriend: string | undefined) => {
  return useSuspenseQuery({
    queryKey: ["messages", selectedFriend],
    queryFn: async () => {
      if (!selectedFriend) return null;
      return await getMessages(selectedFriend);
    },
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    refetchOnMount: true,
  });
};

export default useGetFriendChats;
