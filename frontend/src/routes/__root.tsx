import { Outlet, createRootRoute } from "@tanstack/react-router";
import Sidebar from "../components/Ui/Sidebar";
import useAuth from "../hooks/useAuth";
import NotFound from "../components/Ui/NotFound";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const { user } = useAuth();
  return (
    <div className="bg-background flex h-dvh w-dvw flex-row gap-4 overflow-y-hidden p-3 md:p-6">
      {user ? <Sidebar /> : null}
      <main className="max-w-7xl flex-1 lg:mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
