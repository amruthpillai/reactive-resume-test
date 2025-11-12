import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import { getSectionIcon, getSectionTitle } from "@/utils/resume/section";
import { cn } from "@/utils/style";

export function TemplateSectionBuilder() {
	const collapsed = useSectionStore((state) => state.sections.template?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<div id="sidebar-template" className="space-y-4">
			<div className="flex items-center">
				<Button size="icon" variant="ghost" className="mr-1.5" onClick={() => toggleCollapsed("template")}>
					<CaretDownIcon className={cn("transition-transform", collapsed && "-rotate-90")} />
				</Button>

				<div className="flex flex-1 items-center gap-x-4">
					{getSectionIcon("template")}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{getSectionTitle("template")}</h2>
				</div>
			</div>

			<AnimatePresence>
				{!collapsed && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
					>
						<div />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
