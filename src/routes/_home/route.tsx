import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "./-sections/header";

export const Route = createFileRoute("/_home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
