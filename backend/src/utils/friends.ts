import prisma from "../prisma";

const deleteFriendRequest = async (requestId: string) => {
  try {
    const request = await prisma.request.delete({
      where: {
        id: requestId,
      },
    });
    return { success: true, message: "Request deleted successfully" };
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Error deleting notifications."
    );
  }
};

async function addFriend(userEmail: string, friendEmail: string) {
  try {
    const response = await prisma.friend.create({
      data: {
        userEmail,
        friendEmail,
      },
    });
    return {
      success: true,
      data: response,
      message: "Added friend successfully!",
    };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error ? err.message : "Error Adding friend."
    );
  }
}

export { addFriend, deleteFriendRequest };
