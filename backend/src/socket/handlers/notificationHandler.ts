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
  // socket.on(
  //   "friend_request_response",
  //   async (data: AnswerFriendRequestPayload) => {
  //     emit(data.senderId, "friend_request_notification", io, data.response);
  //     await prisma.request.update({
  //       where: {
  //         id: data.requestId,
  //       },
  //       data: {
  //         status: data.response,
  //       },
  //     });
  //     await prisma.request.delete({
  //       where: {
  //         id: data.requestId,
  //       },
  //     });
  //     // delete request also.
  //   }
  // );
  // socket.on(
  //   "respond_to_friend_request",
  //   async (data: {
  //     sender_id: string;
  //     receiver_id: string;
  //     request_id: string;
  //     status: "ACCEPTED" | "REJECTED";
  //   }) => {
  //     const date = getDateNow();
  //     const id = crypto.randomUUID();
  //     const messageData = {
  //       message: `Your friend request to ${
  //         data.receiver_id
  //       } was ${data.status.toLowerCase()}`,
  //       title: "Friend Request",
  //       receivedAt: date,
  //       id,
  //       email: data.sender_id,
  //     };
  //     emit(data.sender_id, "friend_request_response", io, messageData);
  //     await prisma.notification.create({
  //       data: messageData,
  //     });
  //     await prisma.notification.delete({
  //       where: {
  //         id: data.request_id,
  //       },
  //     });
  //   }
  // );
};

// send notification to sender.
// delete the request
// update the backend.

export const getDateAndId = () => {
  const date = new Date();
  const id = crypto.randomUUID();

  return { date: date.toISOString(), id };
};
