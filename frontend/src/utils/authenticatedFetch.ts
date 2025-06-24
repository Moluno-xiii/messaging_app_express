import toast from "react-hot-toast";

interface AuthErrorResponse {
  message?: string;
  error?: string;
  status: "EXPIRED_TOKEN" | "MISSING_TOKENS" | "INVALID_TOKEN";
}

interface RefreshState {
  isRefreshing: boolean;
  refreshPromise: Promise<void> | null;
}

const refreshState: RefreshState = {
  isRefreshing: false,
  refreshPromise: null,
};

async function authenticatedFetch(
  url: string | URL,
  options: RequestInit = {},
): Promise<Response> {
  const requestOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  };

  try {
    const response: Response = await fetch(url, requestOptions);

    if (response.ok) {
      return response;
    }

    if (response.status === 401) {
      const errorData: AuthErrorResponse = await response.clone().json();

      return await handleAuthenticationError(errorData, url, requestOptions);
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown fetch error occurred");
    }
  }
}

async function handleAuthenticationError(
  errorData: AuthErrorResponse,
  originalUrl: string | URL,
  originalOptions: RequestInit,
): Promise<Response> {
  switch (errorData.status) {
    case "EXPIRED_TOKEN":
      return await handleTokenRefresh(originalUrl, originalOptions);

    case "MISSING_TOKENS":
      handleAuthenticationFailure("No Active Session.");
      throw new Error("Authentication required");

    case "INVALID_TOKEN":
      handleAuthenticationFailure("No Active Session.");
      throw new Error("Authentication required");

    default:
      throw new Error(
        `Unhandled authentication error: ${JSON.stringify(errorData)}`,
      );
  }
}

async function handleTokenRefresh(
  originalUrl: string | URL,
  originalOptions: RequestInit,
): Promise<Response> {
  if (refreshState.isRefreshing && refreshState.refreshPromise) {
    try {
      await refreshState.refreshPromise;

      return await fetch(originalUrl, originalOptions);
    } catch (refreshError: unknown) {
      const errorMessage =
        refreshError instanceof Error
          ? refreshError.message
          : "Token refresh failed";
      handleAuthenticationFailure(errorMessage);
      throw new Error(errorMessage);
    }
  }

  refreshState.isRefreshing = true;
  refreshState.refreshPromise = performTokenRefresh();

  try {
    await refreshState.refreshPromise;

    const retryResponse: Response = await fetch(originalUrl, originalOptions);

    return retryResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown refresh error";

    handleAuthenticationFailure(`Token refresh failed: ${errorMessage}`);
    throw new Error(errorMessage);
  } finally {
    resetRefreshState();
  }
}

async function performTokenRefresh(): Promise<void> {
  try {
    const refreshResponse: Response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!refreshResponse.ok) {
      let errorMessage = "Refresh request failed";
      try {
        const errorData = await refreshResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Refresh failed with status: ${refreshResponse.status}`;
      }

      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown token refresh error");
    }
  }
}

function handleAuthenticationFailure(reason: string): void {
  resetRefreshState();
  toast.error(reason);
  // call logout api from backend route.
  // window.location.href = "/auth/login";
}

function resetRefreshState(): void {
  refreshState.isRefreshing = false;
  refreshState.refreshPromise = null;
}

export default authenticatedFetch;
export type { AuthErrorResponse, RefreshState };
