import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, Reorder } from "motion/react";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useDialogStore } from "@/dialogs/store";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { educationItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionItem } from "../shared/section-item";

export function EducationSectionBuilder() {
	const { openDialog } = useDialogStore();
	const section = useResumeData((state) => state.sections.education);
	const updateResume = useResumeStore((state) => state.updateResume);

	const handleReorder = (items: z.infer<typeof educationItemSchema>[]) => {
		updateResume((draft) => {
			draft.sections.education.items = items;
		});
	};

	const handleAdd = () => {
		openDialog("resume.sections.education.create", undefined);
	};

	return (
		<SectionBase type="education">
			<div className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
				<Reorder.Group layoutScroll axis="y" values={section.items} onReorder={handleReorder}>
					<AnimatePresence presenceAffectsLayout>
						{section.items.map((item) => (
							<SectionItem key={item.id} type="education" item={item} title={item.school} subtitle={item.degree} />
						))}
					</AnimatePresence>
				</Reorder.Group>

				<button
					type="button"
					onClick={handleAdd}
					className="flex w-full items-center gap-x-2 px-3 py-4 font-medium hover:bg-secondary/20 focus:outline-none focus-visible:ring-1"
				>
					<PlusIcon />
					<Trans>Add a new education</Trans>
				</button>
			</div>
		</SectionBase>
	);
}
