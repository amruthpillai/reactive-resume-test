import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import { getSectionIcon, getSectionTitle, type RightSidebarSection } from "@/utils/resume/section";
import { cn } from "@/utils/style";

type Props = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
	type: RightSidebarSection;
	children: React.ReactNode;
};

export function SectionBase({ type, children, className, ...props }: Props) {
	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<div id={`sidebar-${type}`} className="space-y-4">
			<div className="flex items-center">
				<Button size="icon" variant="ghost" className="mr-1.5" onClick={() => toggleCollapsed(type)}>
					<CaretDownIcon className={cn("transition-transform", collapsed && "-rotate-90")} />
				</Button>

				<div className="flex flex-1 items-center gap-x-4">
					{getSectionIcon(type)}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{getSectionTitle(type)}</h2>
				</div>
			</div>

			<AnimatePresence>
				{!collapsed && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
						className={cn("relative space-y-4", className)}
						{...props}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
