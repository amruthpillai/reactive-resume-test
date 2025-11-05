import { Trans } from "@lingui/react/macro";
import { OpenAiLogoIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings/ai")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-2">
				<OpenAiLogoIcon weight="light" className="size-6" />
				<h1 className="font-medium text-2xl tracking-tight">
					<Trans>Artificial Intelligence</Trans>
				</h1>
			</div>

			<Separator />
		</div>
	);
}
