import { Outlet, createRootRoute } from "@tanstack/react-router";
import Sidebar from "../components/Ui/Sidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isUserLoggedin = true;
  return (
    <div className="bg-background flex h-dvh flex-row gap-4 overflow-y-hidden p-6">
      {isUserLoggedin ? <Sidebar /> : null}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
