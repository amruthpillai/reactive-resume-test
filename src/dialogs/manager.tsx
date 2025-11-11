import { match } from "ts-pattern";
import { ChangePasswordDialog } from "./auth/change-password";
import { DisableTwoFactorDialog } from "./auth/disable-two-factor";
import { EnableTwoFactorDialog } from "./auth/enable-two-factor";
import { CreateResumeDialog, DuplicateResumeDialog, UpdateResumeDialog } from "./resume";
import { CreateEducationDialog, UpdateEducationDialog } from "./resume/sections/education";
import { CreateExperienceDialog, UpdateExperienceDialog } from "./resume/sections/experience";
import { CreateProfileDialog, UpdateProfileDialog } from "./resume/sections/profile";
import { CreateSkillDialog, UpdateSkillDialog } from "./resume/sections/skill";
import { useDialogStore } from "./store";

export function DialogManager() {
	const { open, activeDialog, onOpenChange } = useDialogStore();

	if (!activeDialog) return null;

	return match(activeDialog)
		.with({ type: "auth.change-password" }, () => <ChangePasswordDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "auth.two-factor.enable" }, () => <EnableTwoFactorDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "auth.two-factor.disable" }, () => <DisableTwoFactorDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "resume.create" }, () => <CreateResumeDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "resume.update" }, ({ data }) => (
			<UpdateResumeDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.duplicate" }, ({ data }) => (
			<DuplicateResumeDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.profiles.create" }, ({ data }) => (
			<CreateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.profiles.update" }, ({ data }) => (
			<UpdateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.experience.create" }, ({ data }) => (
			<CreateExperienceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.experience.update" }, ({ data }) => (
			<UpdateExperienceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.education.create" }, ({ data }) => (
			<CreateEducationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.education.update" }, ({ data }) => (
			<UpdateEducationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.skills.create" }, ({ data }) => (
			<CreateSkillDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.skills.update" }, ({ data }) => (
			<UpdateSkillDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.exhaustive();
}
