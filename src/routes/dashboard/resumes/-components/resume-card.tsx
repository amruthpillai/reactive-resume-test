import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	FolderOpenIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { BaseCard } from "./base-card";

type ResumeCardProps = React.ComponentProps<"div"> & {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume, ...props }: ResumeCardProps) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();
	const { queryClient } = useRouteContext({ from: "/dashboard" });

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
	const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

	const updatedAt = useMemo(() => {
		return new Date(resume.updatedAt).toLocaleDateString();
	}, [resume.updatedAt]);

	const handleUpdate = () => {
		openDialog("resume.update", { id: resume.id, name: resume.name, slug: resume.slug, tags: resume.tags });
	};

	const handleToggleLock = async () => {
		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		setLockedResume(
			{ id: resume.id, isLocked: !resume.isLocked },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({ queryKey: orpc.resume.list.key() });
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});

		if (!confirmation) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		deleteResume(
			{ id: resume.id },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({ queryKey: orpc.resume.list.key() });
					toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
				},
				onError: (error) => {
					toast.error(error.message, { id: toastId });
				},
			},
		);
	};

	return (
		<div {...props}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<BaseCard title={resume.name} description={t`Last updated on ${updatedAt}`} tags={resume.tags}>
						<img
							alt={resume.name}
							src="https://picsum.photos/849/1200"
							className={cn("size-full object-cover transition-all", resume.isLocked && "blur-xs")}
						/>

						<ResumeLockOverlay isLocked={resume.isLocked} />
					</BaseCard>
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
							<FolderOpenIcon />
							<Trans>Open</Trans>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem disabled={resume.isLocked} onSelect={handleUpdate}>
						<PencilSimpleLineIcon />
						<Trans>Update</Trans>
					</DropdownMenuItem>

					<DropdownMenuItem onSelect={handleToggleLock}>
						{resume.isLocked ? <LockSimpleOpenIcon /> : <LockSimpleIcon />}
						{resume.isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem variant="destructive" disabled={resume.isLocked} onSelect={handleDelete}>
						<TrashSimpleIcon />
						<Trans>Delete</Trans>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ResumeLockOverlay({ isLocked }: { isLocked: boolean }) {
	return (
		<AnimatePresence>
			{isLocked && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.6 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<div className="flex items-center justify-center rounded-full bg-popover p-6">
						<LockSimpleIcon weight="thin" className="size-12" />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
