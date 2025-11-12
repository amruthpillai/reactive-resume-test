import { useCallback, useRef } from "react";
import { useBuilderSidebar, useBuilderSidebarStore } from "@/builder/-store/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getSectionIcon, getSectionTitle, type LeftSidebarSection, leftSidebarSections } from "@/utils/resume/section";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../edge";
import { AwardsSectionBuilder } from "./sections/awards";
import { BasicsSectionBuilder } from "./sections/basics";
import { CertificationsSectionBuilder } from "./sections/certifications";
import { CustomSectionBuilder } from "./sections/custom";
import { EducationSectionBuilder } from "./sections/education";
import { ExperienceSectionBuilder } from "./sections/experience";
import { InterestsSectionBuilder } from "./sections/interests";
import { LanguagesSectionBuilder } from "./sections/languages";
import { PictureSectionBuilder } from "./sections/picture";
import { ProfilesSectionBuilder } from "./sections/profiles";
import { ProjectsSectionBuilder } from "./sections/projects";
import { PublicationsSectionBuilder } from "./sections/publications";
import { ReferencesSectionBuilder } from "./sections/references";
import { SkillsSectionBuilder } from "./sections/skills";
import { SummarySectionBuilder } from "./sections/summary";
import { VolunteerSectionBuilder } from "./sections/volunteer";

export function BuilderSidebarLeft() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-full sm:ml-12">
				<div className="space-y-4 p-4">
					<PictureSectionBuilder />
					<Separator />
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
					<ProjectsSectionBuilder />
					<Separator />
					<SkillsSectionBuilder />
					<Separator />
					<LanguagesSectionBuilder />
					<Separator />
					<InterestsSectionBuilder />
					<Separator />
					<AwardsSectionBuilder />
					<Separator />
					<CertificationsSectionBuilder />
					<Separator />
					<PublicationsSectionBuilder />
					<Separator />
					<VolunteerSectionBuilder />
					<Separator />
					<ReferencesSectionBuilder />
					<Separator />
					<CustomSectionBuilder />
				</div>
			</ScrollArea>
		</>
	);
}

type SidebarEdgeProps = {
	scrollAreaRef: React.RefObject<HTMLDivElement | null>;
};

function SidebarEdge({ scrollAreaRef }: SidebarEdgeProps) {
	const sidebar = useBuilderSidebarStore((state) => state.leftSidebar);
	const toggleSidebar = useBuilderSidebar((state) => state.toggleLeftSidebar);

	const scrollToSection = useCallback(
		(section: LeftSidebarSection) => {
			if (!scrollAreaRef.current || !sidebar) return;

			if (sidebar.isCollapsed()) toggleSidebar();

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ behavior: "smooth" });
		},
		[sidebar, toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="left">
			<div />

			<div className="flex flex-col justify-center gap-y-2">
				{leftSidebarSections.map((section) => (
					<Button
						key={section}
						size="icon"
						variant="ghost"
						title={getSectionTitle(section)}
						onClick={() => scrollToSection(section)}
					>
						{getSectionIcon(section)}
					</Button>
				))}
			</div>

			<UserDropdownMenu>
				{({ session }) => (
					<Button size="icon" variant="ghost">
						<Avatar className="size-6">
							<AvatarImage src={session.user.image ?? undefined} />
							<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
						</Avatar>
					</Button>
				)}
			</UserDropdownMenu>
		</BuilderSidebarEdge>
	);
}
