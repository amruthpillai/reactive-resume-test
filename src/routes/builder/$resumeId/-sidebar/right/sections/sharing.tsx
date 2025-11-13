import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ORPCError } from "@orpc/client";
import { ClipboardIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/hooks/use-confirm";
import { usePrompt } from "@/hooks/use-prompt";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";

export function SharingSectionBuilder() {
	const prompt = usePrompt();
	const confirm = useConfirm();
	const queryClient = useQueryClient();
	const [_, copyToClipboard] = useCopyToClipboard();
	const { data: session } = authClient.useSession();
	const params = useParams({ from: "/builder/$resumeId" });

	const { data: resume } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	const { mutateAsync: updateResume, isPending: isUpdatingResume } = useMutation(orpc.resume.update.mutationOptions());

	const publicUrl = useMemo(() => {
		if (!session) return "";
		return `${window.location.origin}/${session.user.username}/${resume.slug}`;
	}, [session, resume]);

	const onCopyUrl = useCallback(async () => {
		await copyToClipboard(publicUrl);
		toast.success(t`Your resume's public URL has been copied to clipboard.`);
	}, [publicUrl, copyToClipboard]);

	const onTogglePublic = useCallback(
		async (checked: boolean) => {
			try {
				await updateResume({ id: resume.id, isPublic: checked, password: null });
				await queryClient.invalidateQueries({ queryKey: orpc.resume.key() });
			} catch (error) {
				const message = error instanceof ORPCError ? error.message : t`Something went wrong. Please try again.`;
				toast.error(message);
			}
		},
		[queryClient, resume.id, updateResume],
	);

	const onSetPassword = useCallback(async () => {
		const value = await prompt(t`Protect your resume from unauthorized access with a password`, {
			description: t`Anyone visiting the resume's public URL must enter this password to access it.`,
			confirmText: t`Set Password`,
			inputProps: {
				type: "password",
				minLength: 6,
				maxLength: 64,
			},
		});
		if (!value) return;

		const password = value.trim();
		if (!password) return toast.error(t`Password cannot be empty.`);

		const toastId = toast.loading(t`Enabling password protection...`);

		try {
			await updateResume({ id: resume.id, password });
			await queryClient.invalidateQueries({ queryKey: orpc.resume.key() });
			toast.success(t`Password protection has been enabled.`, { id: toastId });
		} catch (error) {
			const message = error instanceof ORPCError ? error.message : t`Something went wrong. Please try again.`;
			toast.error(message, { id: toastId });
		}
	}, [prompt, queryClient, resume.id, updateResume]);

	const onRemovePassword = useCallback(async () => {
		if (!resume.hasPassword) return;

		const confirmation = await confirm(t`Are you sure you want to remove password protection?`, {
			description: t`Anyone who has the resume's public URL will be able to view and download your resume without entering a password.`,
			confirmText: t`Confirm`,
			cancelText: t`Cancel`,
		});
		if (!confirmation) return;

		const toastId = toast.loading(t`Removing password protection...`);

		try {
			await updateResume({ id: resume.id, password: null });
			await queryClient.invalidateQueries({ queryKey: orpc.resume.key() });
			toast.success(t`Password protection has been disabled.`, { id: toastId });
		} catch (error) {
			const message = error instanceof ORPCError ? error.message : t`Something went wrong. Please try again.`;
			toast.error(message, { id: toastId });
		}
	}, [confirm, queryClient, resume.id, resume.hasPassword, updateResume]);

	const isPasswordProtected = resume.hasPassword;

	return (
		<SectionBase type="sharing" className="space-y-4">
			<div className="flex items-center gap-x-4">
				<Switch
					size="md"
					id="sharing-switch"
					checked={resume.isPublic}
					disabled={isUpdatingResume}
					onCheckedChange={(checked) => void onTogglePublic(checked)}
				/>

				<Label htmlFor="sharing-switch" className="flex flex-col items-start gap-y-1 font-normal">
					<p className="font-medium">
						<Trans context="Visibility">Public</Trans>
					</p>

					<span className="text-muted-foreground text-xs">
						<Trans>Anyone with the link can view and download the resume.</Trans>
					</span>
				</Label>
			</div>

			<div
				className={cn(
					"space-y-4 transition-opacity duration-300",
					!resume.isPublic && "pointer-events-none opacity-50",
				)}
			>
				<div className="grid gap-2">
					<Label htmlFor="sharing-url">URL</Label>

					<div className="flex items-center gap-x-2">
						<Input readOnly id="sharing-url" value={publicUrl} />

						<Button size="icon" variant="ghost" onClick={onCopyUrl}>
							<ClipboardIcon />
						</Button>
					</div>
				</div>

				<AnimatePresence presenceAffectsLayout>
					{resume.isPublic && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="rounded-md border p-4"
						>
							<p className="text-muted-foreground">
								{isPasswordProtected ? (
									<Trans>
										Your resume's public link is currently protected by a password. Share the password only with people
										you trust.
									</Trans>
								) : (
									<Trans>
										Optionally, set a password so that only people with the password can view your resume through the
										link.
									</Trans>
								)}
							</p>

							<div className="mt-3 flex flex-wrap gap-2">
								{isPasswordProtected ? (
									<Button variant="outline" onClick={onRemovePassword} disabled={isUpdatingResume}>
										<Trans>Remove Password</Trans>
									</Button>
								) : (
									<Button variant="outline" onClick={onSetPassword} disabled={isUpdatingResume}>
										<Trans>Set Password</Trans>
									</Button>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</SectionBase>
	);
}
