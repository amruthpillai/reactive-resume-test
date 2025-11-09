import { match } from "ts-pattern";
import { ChangePasswordDialog } from "./auth/change-password";
import { DisableTwoFactorDialog } from "./auth/disable-two-factor";
import { EnableTwoFactorDialog } from "./auth/enable-two-factor";
import { CreateResumeDialog, UpdateResumeDialog } from "./resume";
import { CreateProfileDialog, UpdateProfileDialog } from "./resume/sections/profile";
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
		.with({ type: "resume.sections.profiles.create" }, ({ data }) => (
			<CreateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.profiles.update" }, ({ data }) => (
			<UpdateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.exhaustive();
}
