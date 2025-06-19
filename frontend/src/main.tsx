import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./contexts/AuthContext";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import SocketProvider from "./contexts/SocketContext";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <AuthContextProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthContextProvider>
  </QueryClientProvider>,
  // </StrictMode>,
);
