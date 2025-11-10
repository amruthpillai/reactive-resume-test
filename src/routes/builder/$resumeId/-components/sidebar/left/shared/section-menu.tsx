import { t } from "@lingui/core/macro";
import { Plural, Trans } from "@lingui/react/macro";
import { ColumnsIcon, EyeClosedIcon, EyeIcon, ListIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/builder/-store/resume";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrompt } from "@/hooks/use-prompt";
import { getSectionTitle, type SectionType } from "@/schema/resume/data";

type Props = {
	type: SectionType;
};

export function SectionDropdownMenu({ type }: Props) {
	const prompt = usePrompt();
	const section = useResumeData((state) => state.sections[type]);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onToggleVisibility = () => {
		updateResume((draft) => {
			draft.sections[type].hidden = !draft.sections[type].hidden;
		});
	};

	const onRenameSection = async () => {
		const newTitle = await prompt(t`What do you want to rename this section to?`, {
			description: t`Leave empty to reset the title to the original.`,
			defaultValue: section.title,
		});

		if (!newTitle) {
			updateResume((draft) => {
				draft.sections[type].title = getSectionTitle(type);
			});
			return;
		}

		updateResume((draft) => {
			draft.sections[type].title = newTitle;
		});
	};

	const onSetColumns = (value: string) => {
		updateResume((draft) => {
			draft.sections[type].columns = parseInt(value, 10);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<ListIcon />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={onToggleVisibility}>
						{section.hidden ? <EyeIcon /> : <EyeClosedIcon />}
						{section.hidden ? <Trans>Show</Trans> : <Trans>Hide</Trans>}
					</DropdownMenuItem>

					<DropdownMenuItem onSelect={onRenameSection}>
						<PencilSimpleLineIcon />
						<Trans>Rename</Trans>
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<ColumnsIcon />
							<Trans>Columns</Trans>
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={section.columns.toString()} onValueChange={onSetColumns}>
								{[1, 2, 3, 4].map((column) => (
									<DropdownMenuRadioItem key={column} value={column.toString()}>
										<Plural value={column} one="# Column" other="# Columns" />
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
