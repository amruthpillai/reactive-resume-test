import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { type DialogType, useDialogStore } from "@/dialogs/store";
import { useCommandPaletteStore } from "../../store";

export function BuilderAddSectionCommandPage() {
	const { openDialog } = useDialogStore();
	const reset = useCommandPaletteStore((state) => state.reset);

	const onOpenDialog = (type: DialogType) => {
		openDialog(type, undefined);
		reset();
	};

	return (
		<CommandGroup heading={t`Add a new...`}>
			<CommandItem onSelect={() => onOpenDialog("resume.sections.profiles.create")}>
				<Trans>Profile</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.experience.create")}>
				<Trans>Experience</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.education.create")}>
				<Trans>Education</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.projects.create")}>
				<Trans>Project</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.skills.create")}>
				<Trans>Skill</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.languages.create")}>
				<Trans>Language</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.interests.create")}>
				<Trans>Interest</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.awards.create")}>
				<Trans>Award</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.certifications.create")}>
				<Trans>Certification</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.publications.create")}>
				<Trans>Publication</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.volunteer.create")}>
				<Trans>Volunteer Experience</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.references.create")}>
				<Trans>Reference</Trans>
			</CommandItem>

			<CommandItem onSelect={() => onOpenDialog("resume.sections.custom.create")}>
				<Trans>Custom Section</Trans>
			</CommandItem>
		</CommandGroup>
	);
}
