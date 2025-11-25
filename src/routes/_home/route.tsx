import { TranslateIcon } from "@phosphor-icons/react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GithubStarsButton } from "@/components/input/github-stars-button";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeToggleButton } from "@/components/theme/toggle-button";
import { BrandIcon } from "@/components/ui/brand-icon";

export const Route = createFileRoute("/_home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="fixed inset-x-0 top-0 z-20 bg-linear-to-b from-background via-25% via-background to-transparent py-2">
				<div className="container mx-auto flex items-center gap-x-2 px-6 lg:px-12">
					<BrandIcon className="size-12" />

					<div className="ml-auto flex items-center gap-x-3">
						<LocaleCombobox
							buttonProps={{
								size: "icon",
								variant: "ghost",
								className: "justify-center",
								children: () => <TranslateIcon />,
							}}
						/>

						<ThemeToggleButton />

						<GithubStarsButton />
					</div>
				</div>
			</header>

			<Outlet />
		</>
	);
}
