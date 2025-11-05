import { createFileRoute } from "@tanstack/react-router";
import { useResumeData } from "./-store/resume";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const resume = useResumeData();

	return (
		<div>
			<pre>{JSON.stringify(resume, null, 2)}</pre>
		</div>
	);
}
