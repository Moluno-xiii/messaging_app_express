import { Outlet, createRootRoute } from "@tanstack/react-router";
import Sidebar from "../components/Ui/Sidebar";
import useAuth from "../hooks/useAuth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { user } = useAuth();
  return (
    <div className="bg-background flex h-dvh flex-row gap-4 overflow-y-hidden p-6">
      {user ? <Sidebar /> : null}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
