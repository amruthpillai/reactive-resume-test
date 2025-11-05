import { Trans } from "@lingui/react/macro";
import { GearSixIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeCombobox } from "@/components/theme/combobox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings/preferences")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-2">
				<GearSixIcon weight="light" className="size-6" />
				<h1 className="font-medium text-2xl tracking-tight">
					<Trans>Preferences</Trans>
				</h1>
			</div>

			<Separator />

			<div className="grid max-w-xl gap-6">
				<div className="grid gap-1.5">
					<Label className="mb-0.5">
						<Trans>Theme</Trans>
					</Label>
					<ThemeCombobox />
				</div>

				<div className="grid gap-1.5">
					<Label className="mb-0.5">
						<Trans>Language</Trans>
					</Label>
					<LocaleCombobox />
				</div>
			</div>
		</div>
	);
}
