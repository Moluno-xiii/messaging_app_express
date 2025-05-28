import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context was used outside of its scope.");
  }
  return context;
};

export default useAuth;
