import { Server } from "socket.io";
import { CustomSocket } from "../../../types/express/socket";
import { emit } from "../socketServer";
import prisma from "../../prisma";

interface FriendRequestPayload {
  receiverId: string;
}

interface AnswerFriendRequestPayload {
  senderId: string;
  response: "ACCEPTED" | "REJECTED";
  requestId: string;
}

const notificationHandler = (socket: CustomSocket, io: Server) => {
  // socket.on("send_friend_request", (data: FriendRequestPayload) => {
  //   console.log("Sending friend request", data);
  //   emit(data.receiverId, "friend_request", io);
  // });

  socket.on(
    "friend_request_response",
    async (data: AnswerFriendRequestPayload) => {
      emit(data.senderId, "friend_request_notification", io, data.response);
      await prisma.request.update({
        where: {
          id: data.requestId,
        },
        data: {
          status: data.response,
        },
      });
      await prisma.request.delete({
        where: {
          id: data.requestId,
        },
      });
      // delete request also.
    }
  );
};
