import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { verifyToken } from "../../utils/auth";

export const Route = createFileRoute("/auth/verify-email")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      token: search.token as string,
    };
  },
});

function RouteComponent() {
  const { token } = useSearch({ from: Route.id });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/signup", replace: true });
      return;
    }
    (async () => {
      try {
        const response = await verifyToken(token);
        if (response.success) {
          toast.success(response.message);
          navigate({ to: "/auth/login" });
          return;
        }
        throw new Error(response.message);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error, try again.";
        setError(message);
        toast.error(message);
      }
    })();
  }, [token, navigate]);
  return (
    <div>
      {!error ? (
        <>
          <p>Verifying your email...</p>
          <span className="text-primary text-xl">Don't click anything</span>
        </>
      ) : null}
      {error ? (
        <div className="flex flex-col gap-y-2">
          <span className="text-red-600">{error}</span>
          <Link to="/auth/signup" className="btn-error">
            Return to Signup page
          </Link>
        </div>
      ) : null}
      <p>
        <a href="http://localhost:5173/auth/verify-email"></a>
      </p>
    </div>
  );
}
