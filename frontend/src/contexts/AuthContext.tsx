import React, {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";
import useGetUserProfile from "../hooks/queryHooks/useGetUserProfile";

export interface User {
  id: string;
  email: string;
  displayName: string;
  profilePic: string | null;
}

interface ContextTypes {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  logout: (successCb: () => void) => void;
  isLoading: boolean;
}

const AuthContext = createContext<ContextTypes>({
  user: null,
  setUser: () => {},
  isLoading: false,
  logout: () => {},
});

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { isPending, data } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(isPending);

  useEffect(() => {
    async function fetchUserData() {
      // console.log("dat from query hook", data);
      setUser(data);
      // try {
      //   const query = await authenticatedFetch("http://localhost:7002/profile");

      //   const response = await query.json();

      //   if (response.success) {
      //     toast.success("Authentication succesful");
      //     setUser(response.user);
      //   } else {
      //     toast.error(response.message);
      //     setUser(null);
      //   }
      //   return;
      // } catch {
      //   toast.error("No active session");
      //   setUser(null);
      // }
    }

    fetchUserData();
  }, [data]);

  const logout = async (successCb: () => void) => {
    try {
      setIsLoading(true);
      const req = await fetch("http://localhost:7002/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });
      const { success, message } = await req.json();

      setUser(null);
      successCb();
      if (!success) {
        throw new Error(message);
      }
      toast.success(message);
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export { AuthContext };
