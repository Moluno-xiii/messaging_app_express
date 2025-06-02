import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profilie/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Welcome to the profile index page.</div>;
}
