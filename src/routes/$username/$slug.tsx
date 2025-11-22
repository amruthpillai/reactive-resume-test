import { ORPCError } from "@orpc/client";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResumePreview } from "@/components/resume/preview";
import { useResumeStore } from "@/components/resume/store/resume";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";

export const Route = createFileRoute("/$username/$slug")({
	component: RouteComponent,
	loader: async ({ params: { username, slug } }) => {
		const resume = await orpc.resume.getBySlug.call({ username, slug });
		return { resume };
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData ? `${loaderData.resume.name} - Reactive Resume` : "Reactive Resume" }],
	}),
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

	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	if (!isReady) return <LoadingScreen />;

	return (
		<div className={cn("my-8 flex items-center justify-center", "print:my-0 print:block")}>
			<ResumePreview
				pageClassName={cn("rounded-sm border shadow-lg", "print:rounded-none print:border-none print:shadow-none")}
			/>
		</div>
	);
}
