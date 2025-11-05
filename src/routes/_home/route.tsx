import { Trans } from "@lingui/react/macro";
import { TranslateIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeToggleButton } from "@/components/theme/toggle-button";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="fixed inset-x-0 top-0 py-2">
				<div className="container mx-auto flex items-center gap-x-2">
					<BrandIcon className="size-12" />

					<div className="ml-auto flex items-center gap-x-1">
						<Button variant="link">Features</Button>
						<Button variant="link">Templates</Button>

						<LocaleCombobox
							buttonProps={{
								size: "icon",
								variant: "ghost",
								className: "justify-center",
								children: () => <TranslateIcon />,
							}}
						/>
						<ThemeToggleButton />

						<Button asChild className="ml-2">
							<Link to="/dashboard">
								<Trans>Get Started</Trans>
							</Link>
						</Button>
					</div>
				</div>
			</header>

			<Outlet />
		</>
	);
}
