import { useRouteContext } from "@tanstack/react-router";
import { useRef } from "react";
import { useResumeData } from "@/builder/-hooks/resume";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon, getSectionTitle } from "@/utils/resume/section";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../edge";
import { BasicsSectionBuilder } from "./sections/basics";
import { EducationSectionBuilder } from "./sections/education";
import { ExperienceSectionBuilder } from "./sections/experience";
import { ProfilesSectionBuilder } from "./sections/profiles";
import { SkillsSectionBuilder } from "./sections/skills";
import { SummarySectionBuilder } from "./sections/summary";

export function BuilderSidebarLeft() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	const sections = useResumeData((data) => data.sections);
	const { session } = useRouteContext({ from: "/builder/$resumeId" });

	function scrollToSection(section: "basics" | "summary" | SectionType) {
		if (!scrollAreaRef.current) return;
		const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
		if (!sectionElement) return;
		sectionElement.scrollIntoView({ behavior: "smooth" });
	}

	return (
		<>
			<BuilderSidebarEdge side="left">
				<div />

				<div className="flex flex-col justify-center gap-y-2">
					<Button
						size="icon"
						variant="ghost"
						title={getSectionTitle("basics")}
						onClick={() => scrollToSection("basics")}
					>
						{getSectionIcon("basics")}
					</Button>

					<Button
						size="icon"
						variant="ghost"
						title={getSectionTitle("summary")}
						onClick={() => scrollToSection("summary")}
					>
						{getSectionIcon("summary")}
					</Button>

					{Object.keys(sections).map((section) => (
						<Button
							key={section}
							size="icon"
							variant="ghost"
							title={getSectionTitle(section as SectionType)}
							onClick={() => scrollToSection(section as SectionType)}
						>
							{getSectionIcon(section as SectionType)}
						</Button>
					))}
				</div>

				<UserDropdownMenu>
					<Button size="icon" variant="ghost">
						<Avatar className="size-6">
							<AvatarImage src={session.user.image ?? undefined} />
							<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
						</Avatar>
					</Button>
				</UserDropdownMenu>
			</BuilderSidebarEdge>

			<ScrollArea ref={scrollAreaRef} className="@container h-full sm:ml-12">
				<div className="flex flex-col space-y-4 p-4">
					<BasicsSectionBuilder />
					<Separator />
					<SummarySectionBuilder />
					<Separator />
					<ProfilesSectionBuilder />
					<Separator />
					<ExperienceSectionBuilder />
					<Separator />
					<EducationSectionBuilder />
					<Separator />
					<SkillsSectionBuilder />
					<Separator />
				</div>
			</ScrollArea>
		</>
	);
}
