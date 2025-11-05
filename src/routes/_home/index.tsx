import { Trans } from "@lingui/react/macro";
import { BookIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			{/* Hero */}
			<div className="flex h-dvh items-center justify-center">
				<div className="flex max-w-xl flex-col items-center gap-y-8 px-4 xs:px-0 text-center">
					<div>
						<Trans>
							<p className="font-semibold text-base tracking-tight">Finally,</p>
							<h1 className="font-bold text-5xl tracking-tight">A free and open-source resume builder</h1>
						</Trans>
					</div>

					<p className="text-base text-muted-foreground">
						<Trans>
							Reactive Resume is a free and open-source resume builder that simplifies the process of creating,
							updating, and sharing your resume.
						</Trans>
					</p>

					<div className="flex items-center gap-x-2">
						<Button asChild size="lg">
							<Link to="/dashboard">
								<Trans>Get Started</Trans>
							</Link>
						</Button>

						<Button asChild size="lg" variant="link">
							<Link to="/">
								<BookIcon />
								<Trans>Learn More</Trans>
							</Link>
						</Button>
					</div>
				</div>
			</div>

			<div className="h-dvh"></div>
		</div>
	);
}
