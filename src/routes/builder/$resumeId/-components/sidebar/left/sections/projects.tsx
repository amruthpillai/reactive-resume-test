import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, Reorder } from "motion/react";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useDialogStore } from "@/dialogs/store";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { projectItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionItem } from "../shared/section-item";

export function ProjectsSectionBuilder() {
	const { openDialog } = useDialogStore();
	const section = useResumeData((state) => state.sections.projects);
	const updateResume = useResumeStore((state) => state.updateResume);

	const handleReorder = (items: z.infer<typeof projectItemSchema>[]) => {
		updateResume((draft) => {
			draft.sections.projects.items = items;
		});
	};

	const handleAdd = () => {
		openDialog("resume.sections.projects.create", undefined);
	};

	const buildSubtitle = (item: z.infer<typeof projectItemSchema>) => {
		const parts = [item.period, item.website.label].filter((part) => part && part.trim().length > 0);
		return parts.length > 0 ? parts.join(" • ") : undefined;
	};

	return (
		<SectionBase type="projects">
			<div className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
				<Reorder.Group layoutScroll axis="y" values={section.items} onReorder={handleReorder}>
					<AnimatePresence presenceAffectsLayout>
						{section.items.map((item) => (
							<SectionItem key={item.id} type="projects" item={item} title={item.name} subtitle={buildSubtitle(item)} />
						))}
					</AnimatePresence>
				</Reorder.Group>

				<button
					type="button"
					onClick={handleAdd}
					className="flex w-full items-center gap-x-2 px-3 py-4 font-medium hover:bg-secondary/20 focus:outline-none focus-visible:ring-1"
				>
					<PlusIcon />
					<Trans>Add a new project</Trans>
				</button>
			</div>
		</SectionBase>
	);
}
