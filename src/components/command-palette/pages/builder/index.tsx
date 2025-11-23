import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CopySimpleIcon, PlusIcon, ToggleLeftIcon } from "@phosphor-icons/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { useResumeStore } from "@/components/resume/store/resume";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { authClient } from "@/integrations/auth/client";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import { useBuilderSidebar } from "@/routes/builder/$resumeId/-store/sidebar";
import { useCommandPaletteStore } from "../../store";

export function BuilderCommandGroup() {
	const { toggleSidebar } = useBuilderSidebar();
	const [_, copyToClipboard] = useCopyToClipboard();
	const { data: session } = authClient.useSession();
	const resume = useResumeStore((state) => state.resume);
	const reset = useCommandPaletteStore((state) => state.reset);
	const pushPage = useCommandPaletteStore((state) => state.pushPage);
	const onToggleSections = useSectionStore((state) => state.toggleAll);

	const onCopyLink = useCallback(async () => {
		if (!resume) return;
		const link = `${window.location.origin}/${session?.user.username}/${resume.slug}`;
		await copyToClipboard(link);
		toast.success(t`A link to your resume has been copied to clipboard.`);
		reset();
	}, [session, copyToClipboard, reset, resume]);

	const onToggleSidebars = useCallback(() => {
		toggleSidebar("left");
		toggleSidebar("right");
	}, [toggleSidebar]);

	if (!resume) return null;

	return (
		<>
			<CommandGroup heading={resume.name}>
				<CommandItem onSelect={() => pushPage("add-section")}>
					<PlusIcon />
					<Trans>Add a new section item</Trans>
				</CommandItem>

				<CommandItem onSelect={onCopyLink}>
					<CopySimpleIcon />
					<Trans>Copy link to resume</Trans>
				</CommandItem>
			</CommandGroup>

			<CommandGroup heading={<Trans>Layout</Trans>}>
				<CommandItem onSelect={onToggleSidebars}>
					<ToggleLeftIcon />
					<Trans>Toggle sidebars</Trans>
				</CommandItem>

				<CommandItem onSelect={onToggleSections}>
					<ToggleLeftIcon />
					<Trans>Toggle sections</Trans>
				</CommandItem>
			</CommandGroup>
		</>
	);
}
