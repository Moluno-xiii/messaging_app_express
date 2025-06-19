import { Server } from "socket.io";
import { CustomSocket } from "../../../types/express/socket";
import { getUserSockets } from "../socketMap";
import { emit } from "../socketServer";

interface SendMessagePayload {
  receiverId: string;
  message: string;
}

interface TypingPayload {
  receiverId: string;
  isTyping: boolean;
}

const messageHandler = (socket: CustomSocket, io: Server) => {
  // socket.on("send_message", (data: SendMessagePayload) => {
  //   console.log("sending message ", data);
  //   emit(data.receiverId, "send_message", io, data.message);
  // });
  // socket.on("typing", (data: TypingPayload) => {
  //   console.log("User is typing", data);
  //   emit(data.receiverId, "typing", io, data.isTyping);
  // });
};

export default messageHandler;
