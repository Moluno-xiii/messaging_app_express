import React, {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";
import authenticatedFetch from "../utils/authenticatedFetch";

interface User {
  id: string;
  iat: number;
  exp: number;
  sessionId: string;
  email: string;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const query = await authenticatedFetch("http://localhost:7002/me");

        const response = await query.json();
        toast.success("Authentication succesful");
        setUser(response.user);
      } catch {
        toast.error("No active session");
        setUser(null);
      }
    }

    fetchUserData();
  }, []);

  const logout = async (successCb: () => void) => {
    try {
      setIsLoading(true);
      const req = await fetch("http://localhost:7002/auth/logout", {
        method: "POST",
        body: JSON.stringify({ sessionId: user?.sessionId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });
      const { error, message } = await req.json();

      if (error) {
        throw new Error(error);
      }
      successCb();
      setUser(null);
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
