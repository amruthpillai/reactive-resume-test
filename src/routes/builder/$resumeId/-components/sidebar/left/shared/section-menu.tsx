import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ColumnsIcon, EyeClosedIcon, EyeIcon, ListIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
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
import { useResumeData } from "@/routes/builder/$resumeId/-hooks/resume";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { SectionType } from "@/schema/resume";

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
			defaultValue: section.title,
		});

		if (!newTitle) {
			// TODO: Reset the title to the original title
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
								<DropdownMenuRadioItem value="1">
									<Trans>1 Column</Trans>
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="2">
									<Trans>2 Columns</Trans>
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="3">
									<Trans>3 Columns</Trans>
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="4">
									<Trans>4 Columns</Trans>
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
