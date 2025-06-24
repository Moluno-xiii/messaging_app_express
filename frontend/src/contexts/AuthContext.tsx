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
import socket from "../utils/socket";

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
  const { data } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(data);
    setIsLoading(false);
  }, [data]);

  const logout = async (successCb: () => void) => {
    try {
      setIsLoading(true);
      const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });
      const { success, message } = await req.json();
      socket.emit("logout");
      setUser(null);
      successCb();
      if (!success) {
        throw new Error(message);
      }
      toast.success(message);
    } catch (err: unknown) {
      toast.error("Logout failed");
      console.error("logout error", err);
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
