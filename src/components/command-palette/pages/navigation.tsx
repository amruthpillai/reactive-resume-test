import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { GearIcon, HouseSimpleIcon, ReadCvLogoIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandPaletteStore } from "../store";

export function NavigationCommandGroup() {
	const navigate = useNavigate();
	const reset = useCommandPaletteStore((state) => state.reset);

	function onNavigate(path: string) {
		navigate({ to: path });
		reset();
	}

	return (
		<CommandGroup heading={<Trans>Go to...</Trans>}>
			<CommandItem keywords={[t`Home`]} value="navigation.home" onSelect={() => onNavigate("/")}>
				<HouseSimpleIcon />
				<Trans>Home</Trans>
			</CommandItem>

			<CommandItem keywords={[t`Resumes`]} value="navigation.resumes" onSelect={() => onNavigate("/dashboard/resumes")}>
				<ReadCvLogoIcon />
				<Trans>Resumes</Trans>
			</CommandItem>

			<CommandItem
				keywords={[t`Settings`]}
				value="navigation.settings"
				onSelect={() => onNavigate("/dashboard/settings/profile")}
			>
				<GearIcon />
				<Trans>Settings</Trans>
			</CommandItem>
		</CommandGroup>
	);
}
