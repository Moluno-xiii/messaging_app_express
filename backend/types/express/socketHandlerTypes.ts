import { RequestStatus } from "../../src/generated/prisma";
interface SendNotification {
  id: string;
  email: string;
  message: string;
  title: string;
  receivedAt: string;
  hasUserRead: boolean;
}

interface FriendRequestType {
  requestedToEmail: string;
  requesterEmail: string;
  id: string;
  dateSent: string;
  dateResponded: string;
  status: RequestStatus;
}

interface MessageRequestType {}

interface MessageData {
  senderId: string;
  receiverId: string;
  mesasge: string;
  id: string;
  date_created: string;
  date_updated: string;
}
interface Typing {
  selectedFriend: string;
  status: boolean;
}

interface UserStatus {
  userStatus: "online" | "offline";
  friendEmail: string;
}

type HandlerPayloads =
  | SendNotification
  | FriendRequestType
  | MessageData
  | Typing
  | UserStatus;

export type { SendNotification, HandlerPayloads, Typing };
