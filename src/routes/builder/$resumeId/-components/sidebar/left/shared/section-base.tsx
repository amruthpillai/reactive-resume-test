import { useResumeData } from "@/builder/-hooks/resume";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { SectionMask } from "./section-mask";
import { SectionDropdownMenu } from "./section-menu";

type Props = React.ComponentProps<"div"> & {
	type: SectionType;
	children: React.ReactNode;
};

export function SectionBase({ type, className, children, ...props }: Props) {
	const section = useResumeData((state) => state.sections[type]);

	return (
		<div id={`sidebar-${type}`} className={cn("space-y-4", className)} {...props}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					{getSectionIcon(type)}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{section.title}</h2>
				</div>

				<SectionDropdownMenu type={type} />
			</div>

			<div className="relative flex flex-col gap-4">
				<SectionMask hidden={section.hidden} />

				{children}
			</div>
		</div>
	);
}
