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

type HandlerPayloads = SendNotification | FriendRequestType;

export type { SendNotification, HandlerPayloads };
