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
  senderId: string;
  body: string;
  timeSent: string;
  id: string;
}

export type { ChatTypes, LinkType, Message };
