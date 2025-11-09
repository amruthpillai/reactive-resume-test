import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	DotsSixVerticalIcon,
	DotsThreeVerticalIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { Reorder, useDragControls } from "motion/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { SectionItem as SectionItemType, SectionType } from "@/schema/resume/data";

type Props<T extends SectionItemType> = {
	type: SectionType;
	item: T;
	title: string;
	subtitle?: string;
};

export function SectionItem<T extends SectionItemType>({ type, item, title, subtitle }: Props<T>) {
	const confirm = useConfirm();
	const controls = useDragControls();
	const { openDialog } = useDialogStore();
	const updateResume = useResumeStore((state) => state.updateResume);

	const onUpdate = () => {
		// @ts-expect-error - Expected to throw an error until all section types are supported
		openDialog(`resume.sections.${type}.update`, item);
	};

	const onDuplicate = () => {
		// @ts-expect-error - Expected to throw an error until all section types are supported
		openDialog(`resume.sections.${type}.create`, item);
	};

	const onDelete = async () => {
		const confirmed = await confirm("Are you sure you want to delete this item?", {
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if (!confirmed) return;

		updateResume((draft) => {
			const section = draft.sections[type];
			if (!("items" in section)) return;
			const index = section.items.findIndex((_item) => _item.id === item.id);
			if (index === -1) return;
			section.items.splice(index, 1);
		});
	};

	return (
		<Reorder.Item
			key={item.id}
			value={item}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="group flex h-18 select-none border-b last:border-b-0"
			dragListener={false}
			dragControls={controls}
		>
			<div
				className="flex cursor-ns-resize items-center px-1.5 opacity-20 transition-[background-color,opacity] hover:bg-secondary/20 group-hover:opacity-100"
				onPointerDown={(e) => controls.start(e)}
			>
				<DotsSixVerticalIcon />
			</div>

			<div onClick={onUpdate} className="flex flex-1 flex-col justify-center space-y-0.5 pl-3 hover:bg-secondary/20">
				<div className="font-medium">{title}</div>
				{subtitle && <div className="text-muted-foreground text-xs">{subtitle}</div>}
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex cursor-context-menu items-center px-1.5 opacity-20 transition-[background-color,opacity] hover:bg-secondary/20 group-hover:opacity-100">
						<DotsThreeVerticalIcon />
					</div>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={onUpdate}>
							<PencilSimpleLineIcon />
							<Trans>Update</Trans>
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={onDuplicate}>
							<CopySimpleIcon />
							<Trans>Duplicate</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem variant="destructive" onSelect={onDelete}>
							<TrashSimpleIcon />
							<Trans>Delete</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</Reorder.Item>
	);
}
