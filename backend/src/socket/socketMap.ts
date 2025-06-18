const userSocketMap = new Map<string, Set<string>>();

const addUserSocket = (userId: string, socketId: string) => {
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId)?.add(socketId);
};

const getUserSockets = (userId: string): string[] => {
  return Array.from(userSocketMap.get(userId) ?? []);
};

const removeUserSocket = (userId: string, socketId: string) => {
  const sockets = userSocketMap.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    userSocketMap.delete(userId);
  }
};

export { addUserSocket, getUserSockets, removeUserSocket };
