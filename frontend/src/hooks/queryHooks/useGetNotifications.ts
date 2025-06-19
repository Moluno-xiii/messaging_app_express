import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "../../utils/notifications";

const useGetNotifications = (type: "unread" | "read" | "all" = "all") => {
  return useQuery({
    queryKey: ["notifications", type],
    queryFn: async () => await getUserNotifications(type),
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetNotifications;
