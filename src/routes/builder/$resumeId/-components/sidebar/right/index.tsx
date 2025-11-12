import { useCallback, useRef } from "react";
import { useBuilderSidebar, useBuilderSidebarStore } from "@/builder/-store/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	getSectionIcon,
	getSectionTitle,
	type RightSidebarSection,
	rightSidebarSections,
} from "@/utils/resume/section";
import { BuilderSidebarEdge } from "../edge";
import { TemplateSectionBuilder } from "./sections/template";

export function BuilderSidebarRight() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-full sm:mr-12">
				<div className="flex flex-col space-y-4 p-4">
					<TemplateSectionBuilder />
					<Separator />
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
		(section: RightSidebarSection) => {
			if (!scrollAreaRef.current || !sidebar) return;

			if (sidebar.isCollapsed()) toggleSidebar();

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ behavior: "smooth" });
		},
		[sidebar, toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="right">
			<div />

			{rightSidebarSections.map((section) => (
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

			<div />
		</BuilderSidebarEdge>
	);
}
