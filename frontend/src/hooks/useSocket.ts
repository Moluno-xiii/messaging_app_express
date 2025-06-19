import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const useSocket = () => {
  const socketContext = useContext(SocketContext);
  if (!socketContext)
    throw new Error("SocketContext was used outside of it's scope");
  return socketContext;
};

export default useSocket;
