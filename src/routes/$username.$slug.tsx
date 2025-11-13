import { ORPCError } from "@orpc/client";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { orpc } from "@/integrations/orpc/client";

export const Route = createFileRoute("/$username/$slug")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { username, slug } = params;
		const resume = await orpc.resume.public.getBySlug.call({ username, slug });
		return { resume };
	},
	onError: (error) => {
		if (error instanceof ORPCError && error.code === "NEED_PASSWORD") {
			const data = error.data as { username?: string; slug?: string } | undefined;
			const username = data?.username;
			const slug = data?.slug;

			if (username && slug) {
				throw redirect({
					to: "/auth/resume-password",
					search: { redirect: `/${username}/${slug}` },
				});
			}
		}

		throw notFound();
	},
});

function RouteComponent() {
	const { resume } = Route.useLoaderData();

	return (
		<div>
			<pre>{JSON.stringify(resume, null, 2)}</pre>
		</div>
	);
}
