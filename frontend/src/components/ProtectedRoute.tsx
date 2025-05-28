import { useEffect, type PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import Loading from "./Ui/Loading";

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      toast.error(
        "You're not authenticated, you need to be logged in to access this page",
      );
      navigate({ to: "/auth/login", replace: true });
    }
  }, [user]);

  if (user === undefined) {
    return <Loading />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
