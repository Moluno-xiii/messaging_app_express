import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../../utils/messages";
import toast from "react-hot-toast";

const useSendMessage = (selectedFriend: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) =>
      await sendMessage(selectedFriend, message),
    onSuccess: () => {
      toast.success("Message sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedFriend],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useSendMessage;
