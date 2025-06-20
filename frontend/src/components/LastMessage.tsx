import { useSuspenseQuery } from "@tanstack/react-query";
import ErrorMessage from "./Ui/ErrorMessage";
import { getLastMessage } from "../utils/messages";
import { ISOToString } from "../utils/helpers";

interface Props {
  friendEmail: string;
}
const LastMessage: React.FC<Props> = ({ friendEmail }) => {
  const { data, error } = useSuspenseQuery({
    queryKey: ["lastMessage", friendEmail],
    queryFn: async () => {
      return await getLastMessage(friendEmail);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    select: (res) => res.data,
  });
  if (error) return <ErrorMessage message={error.message} />;
  console.log("data", data);
  if (!data)
    return (
      <span className="text-foreground/50 text-sm italic">
        No chats with this user yet...
      </span>
    );
  return (
    <div className="text-foreground/70 flex flex-row items-center justify-between text-sm">
      <span className="">
        {data.mesasge.length > 35
          ? data.mesasge.split("").slice(0, 35).join("") + "..."
          : data.mesasge}
      </span>
      <span className="">{ISOToString(data.date_created).split(",")[3]}</span>
    </div>
  );
};

export default LastMessage;
