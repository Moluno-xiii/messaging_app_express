import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "../../utils/notifications";

const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await getUserNotifications(),
    staleTime: 0,
  });
};

export default useGetNotifications;
