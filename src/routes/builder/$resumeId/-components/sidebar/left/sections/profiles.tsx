import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, Reorder } from "motion/react";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { profileItemSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";
import { SectionItem } from "../shared/section-item";

export function ProfilesSectionBuilder() {
	const { openDialog } = useDialogStore();
	const section = useResumeData((state) => state.sections.profiles);
	const updateResume = useResumeStore((state) => state.updateResume);

	const handleReorder = (items: z.infer<typeof profileItemSchema>[]) => {
		updateResume((draft) => {
			draft.sections.profiles.items = items;
		});
	};

	return (
		<SectionBase type="profiles">
			<div className="rounded-md border">
				<Reorder.Group layoutScroll axis="y" values={section.items} onReorder={handleReorder}>
					<AnimatePresence presenceAffectsLayout>
						{section.items.map((item) => (
							<SectionItem
								key={item.id}
								type="profiles"
								item={item}
								title={item.network}
								subtitle={`@${item.username}`}
							/>
						))}
					</AnimatePresence>
				</Reorder.Group>
			</div>

			<Button
				variant="ghost"
				className="self-start"
				onClick={() => openDialog("resume.sections.profiles.create", undefined)}
			>
				<PlusIcon />
				<Trans>Add a new item</Trans>
			</Button>
		</SectionBase>
	);
}
