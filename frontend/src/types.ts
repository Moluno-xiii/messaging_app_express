import type { ReactNode } from "react";

interface ChatTypes {
  userImage: string;
  message: string;
  numberOfUnreadMessages: number;
  time: string;
  name: string;
  id: string;
}

interface LinkType {
  route: string;
  component: ReactNode;
}

interface Message {
  date_created: string;
  date_updated: string;
  id: string;
  mesasge: string;
  receiverId: string;
  senderId: string;
}

interface FriendRequestType {
  id: string;
  requestedToEmail: string;
  requesterEmail: string;
  status: FriendRequestStatus;
  dateSent: string;
  dateResponded: string;
}

interface Notification {
  email: string;
  id: string;
  message: string;
  title: string;
}

interface Friend {
  friendEmail: string;
  id: string;
  staus: "OFFLINE" | "ONLINE";
  userEmail: string;
}

interface FriendProfile {
  displayName: string;
  email: string;
  id: string;
  profilePic: string | null;
}

interface FriendDetails {
  profilePic: string | null;
  email: string;
  displayName: string;
}

interface WsOnlineStatus {
  userStatus: "online" | "offline";
  friendEmail: string;
}

type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type {
  ChatTypes,
  LinkType,
  Message,
  FriendRequestType,
  Notification,
  Friend,
  FriendRequestStatus,
  FriendProfile,
  FriendDetails,
  WsOnlineStatus,
};
