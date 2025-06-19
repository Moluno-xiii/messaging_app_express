import { createContext, useEffect, type PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";
import socket from "../utils/socket";
import { useQueryClient } from "@tanstack/react-query";

interface MessagePayload {
  message: string;
  receiver_id: string;
}

interface FriendRequest {
  dateResponded: string;
  dateSent: string;
  id: string;
  requestedToEmail: string;
  requesterEmail: string;
  status: "PENDING" | "REJECTED";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  email: string;
  receivedAt: string;
}

interface ReceivedFriendRequest {
  requests: FriendRequest[];
  success: boolean;
  message: string;
}

interface ReceivedNotification {
  success: boolean;
  message: string;
  data: Notification[];
}
interface SocketTypes {
  sendFriendRequest: (receiver_id: string) => void;
  sendMessage: (data: MessagePayload) => void;
  respondToFriendRequest: (data: {
    sender_id: string;
    request_id: string;
  }) => void;
  readNotification: (id: string) => void;
}
const SocketContext = createContext<SocketTypes>({
  sendFriendRequest: () => {},
  sendMessage: () => {},
  respondToFriendRequest: () => {},
  readNotification: () => {},
});

const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected successfully", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connect error ", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("receive_friend_request", (data: FriendRequest) => {
      queryClient.setQueryData<ReceivedFriendRequest>(
        ["friendRequests", "received"],
        (old) => {
          return {
            ...old,
            requests: [data],
            success: true,
            message: "Friend request received",
          };
        },
      );
    });

    socket.on("new_friend_added", () => {
      console.log("friend was added");
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    });

    socket.on("friend_request_response", (data: Notification) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread"],
      });
      queryClient.setQueryData<ReceivedNotification>(
        ["notifications", "all"],
        (old) => {
          console.log("old data", old);
          return {
            ...old,
            data: [data],
            success: true,
            message: "Friend request accepted or rejected",
          };
        },
      );
      queryClient.setQueryData<ReceivedNotification>(
        ["notifications", "unread"],
        (old) => {
          console.log("old data", old);
          return {
            ...old,
            data: [data],
            success: true,
            message: "Friend request accepted or rejected",
          };
        },
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_friend_request");
    };
  }, [user, queryClient]);

  const sendMessage = (data: MessagePayload) => {
    socket.emit("send_message", data);
  };

  const sendFriendRequest = (receiver_id: string) => {
    socket.emit("send_friend_request", receiver_id);
  };

  const respondToFriendRequest = (data: {
    sender_id: string;
    request_id: string;
  }) => {
    socket.emit("respond_to_friend_request", data);
  };

  const readNotification = (id: string) => {
    socket.emit("read_notification", id);
    queryClient.setQueryData<ReceivedNotification>(
      ["notifications", "unread"],
      (old) => {
        const oldData = old?.data ?? [];
        console.log("old daa", old);
        return {
          ...old,
          data: oldData?.filter((n) => n.id !== id),
          success: true,
          message: "Notification marked as read",
        };
      },
    );
  };

  // how do i handle concurrent typing status for all user's friends that are currently typing at the same time.
  // user should be able to get visual feeedback both when they're viewing the chat details, and when they're not.
  // const getTypingStatus = () => {
  //   socket.on("is_user_typing", (data) => {
  //     console.log("is User typing", data);
  //     // all users mapped and displayed on the chats section would have a listener listening for if the user is typing, and if that's true, the ui should change.
  //     // look at performance opimizations for rerendering. or could just use a ternary
  //   });
  // };
  return (
    <SocketContext.Provider
      value={{
        sendFriendRequest,
        sendMessage,
        respondToFriendRequest,
        readNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
export default SocketProvider;

// fetch other notifications alongside friend requests, display the total number of both of them.
// other notifications should only fetch the ones that havent been read on the sidebar component, but fetch everything on the main component.
// when user accepts or rejects friend requests, the notification count disappears.
// when user reads a notification, mark as unread also, display change on the sidebar number.
