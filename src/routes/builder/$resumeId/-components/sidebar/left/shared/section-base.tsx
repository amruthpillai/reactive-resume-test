import { Trans } from "@lingui/react/macro";
import { EyeClosedIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useResumeData } from "@/builder/-hooks/resume";
import type { SectionType } from "@/schema/resume";
import { cn } from "@/utils/style";
import { SectionDropdownMenu } from "./section-menu";

type Props = React.ComponentProps<"div"> & {
	type: SectionType;
	children: React.ReactNode;
};

export function SectionBase({ type, className, children, ...props }: Props) {
	const section = useResumeData((state) => state.sections[type]);

	return (
		<div id={`section-${type}`} className={cn("space-y-4", className)} {...props}>
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl tracking-tight">{section.title}</h2>

				<SectionDropdownMenu type={type} />
			</div>

			<div className="relative">
				<AnimatePresence>
					{section.hidden && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/50 px-4 text-center backdrop-blur-xs"
						>
							<EyeClosedIcon className="size-6" />
							<p className="font-medium">
								<Trans>This section is hidden from the resume.</Trans>
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				{children}
			</div>
		</div>
	);
}
