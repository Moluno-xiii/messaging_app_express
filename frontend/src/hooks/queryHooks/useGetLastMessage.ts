import { useSuspenseQuery } from "@tanstack/react-query";
import { getLastMessage } from "../../utils/messages";

const useGetLastMessage = (friendEmail: string) => {
  return useSuspenseQuery({
    queryKey: ["lastMessage", friendEmail],
    queryFn: async () => {
      return await getLastMessage(friendEmail);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetLastMessage;
