import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUserProfile } from "../../utils/profile";
import useAuth from "../useAuth";

const useGetUserProfile = () => {
  const { setUser } = useAuth();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { message, success, user } = await getUserProfile();
      if (!success) {
        toast.error(message);
        return null;
      }
      toast.success("Profile fetched successfully!");
      setUser(user);
      return user;
    },
    staleTime: Infinity,
  });
};

export default useGetUserProfile;
