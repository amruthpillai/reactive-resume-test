import { Trans } from "@lingui/react/macro";
import { PaletteIcon, TranslateIcon } from "@phosphor-icons/react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandPaletteStore } from "../../store";

export function PreferencesCommandGroup() {
	const pushPage = useCommandPaletteStore((state) => state.pushPage);

	return (
		<CommandGroup heading={<Trans>Preferences</Trans>}>
			<CommandItem onSelect={() => pushPage("theme")}>
				<PaletteIcon />
				<Trans>Change theme to...</Trans>
			</CommandItem>

			<CommandItem onSelect={() => pushPage("language")}>
				<TranslateIcon />
				<Trans>Change language to...</Trans>
			</CommandItem>
		</CommandGroup>
	);
}
