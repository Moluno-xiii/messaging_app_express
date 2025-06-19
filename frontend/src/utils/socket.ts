import { io } from "socket.io-client";

const socket = io("http://localhost:7002", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
