import { useState } from "react";
import useGetFriendRequests from "../hooks/queryHooks/useGetFriendRequests";
import useDeleteFriendRequest from "../hooks/queryMutations/useDeleteFriendRequest";
import useHandleFriendRequest from "../hooks/queryMutations/useHandleFriendRequest";
import useAuth from "../hooks/useAuth";
import type { FriendRequestStatus, FriendRequestType } from "../types";
import ErrorMessage from "./Ui/ErrorMessage";
import Loading from "./Ui/Loading";

interface Props {
  type: "sent" | "received";
}

const FriendRequests: React.FC<Props> = ({ type }) => {
  const { isPending, error, data: requests } = useGetFriendRequests(type);

  if (error) return <ErrorMessage message={error.message} />;
  if (isPending) return <Loading />;

  return (
    <ul className="flex flex-col gap-y-3">
      {requests.length > 0 ? (
        requests.map((request: FriendRequestType) => (
          <FriendRequest request={request} key={request.id} />
        ))
      ) : (
        <span className="flex flex-col items-center justify-center text-center text-2xl md:text-3xl">
          You have no {type} requests yet.
        </span>
      )}
    </ul>
  );
};

export default FriendRequests;

const FriendRequest = ({ request }: { request: FriendRequestType }) => {
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] =
    useState<FriendRequestStatus>("PENDING");
  const handleRequest = useHandleFriendRequest(request, requestStatus);
  const deleteRequest = useDeleteFriendRequest();

  return (
    <li className="border-primary flex flex-col gap-y-2 rounded-md border p-3">
      <span>
        From :{" "}
        {request.requesterEmail === user?.email
          ? "YOU"
          : request.requesterEmail}
      </span>
      <span>Date Sent : {request.dateSent.split("T").join(", ")}</span>
      {request.dateResponded !== request.dateSent ? (
        <span>Date responded : {request.dateResponded}</span>
      ) : null}
      {request.status === "PENDING" &&
      request.requesterEmail !== user?.email ? (
        <div className="flex flex-row gap-x-5">
          <button
            className="btn-fill"
            onClick={() => {
              setRequestStatus("ACCEPTED");
              handleRequest.mutate(request.id);
            }}
          >
            {handleRequest.isPending && requestStatus === "ACCEPTED"
              ? "Accepting..."
              : "  Accept"}
          </button>
          <button
            className="btn-error"
            onClick={() => {
              setRequestStatus("REJECTED");
              handleRequest.mutate(request.id);
            }}
          >
            {handleRequest.isPending && requestStatus === "REJECTED"
              ? "Rejecting..."
              : "  Reject"}
          </button>
        </div>
      ) : (
        <div>
          <p>Status : {request.status}</p>
          <button
            className="btn-error"
            onClick={() => deleteRequest.mutate(request.id)}
          >
            {deleteRequest.isPending
              ? "Deleting request..."
              : " Delete request"}
          </button>
        </div>
      )}
    </li>
  );
};
