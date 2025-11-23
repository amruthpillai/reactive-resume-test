import { Trans } from "@lingui/react/macro";
import { ReadCvLogoIcon } from "@phosphor-icons/react";
import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandPaletteStore } from "../store";
import { BuilderCommandGroup } from "./builder";
import { NavigationCommandGroup } from "./navigation";
import { PreferencesCommandGroup } from "./preferences";

export function HomeCommandPage() {
	const location = useLocation();
	const pushPage = useCommandPaletteStore((state) => state.pushPage);

	const isBuilder = useMemo(() => location.pathname.startsWith("/builder"), [location.pathname]);

	return (
		<>
			{isBuilder && <BuilderCommandGroup />}

			<CommandGroup heading={<Trans>Search for...</Trans>}>
				<CommandItem onSelect={() => pushPage("resumes")}>
					<ReadCvLogoIcon />
					<Trans>Resumes</Trans>
				</CommandItem>
			</CommandGroup>

			<PreferencesCommandGroup />

			<NavigationCommandGroup />
		</>
	);
}
