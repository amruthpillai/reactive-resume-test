import { CaretDownIcon, HouseSimpleIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBuilderSidebar } from "../-store/builder";
import { useResumeStore } from "../-store/resume";

export function BuilderHeader() {
	const isMobile = useIsMobile();
	const resume = useResumeStore((state) => state.resume);
	const { leftSidebar, rightSidebar } = useBuilderSidebar();

	const defaultSidebarSize = useMemo(() => (isMobile ? 95 : 30), [isMobile]);

	const toggleLeftSidebar = useCallback(() => {
		const sidebar = leftSidebar.current;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(defaultSidebarSize) : sidebar.collapse();
	}, [leftSidebar, defaultSidebarSize]);

	const toggleRightSidebar = useCallback(() => {
		const sidebar = rightSidebar.current;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(defaultSidebarSize) : sidebar.collapse();
	}, [rightSidebar, defaultSidebarSize]);

	return (
		<div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-popover px-1.5 shadow">
			<Button size="icon" variant="ghost" onClick={toggleLeftSidebar}>
				<SidebarSimpleIcon />
			</Button>

			<div className="flex items-center gap-x-1">
				<Button asChild size="icon" variant="ghost">
					<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
						<HouseSimpleIcon />
					</Link>
				</Button>
				<span className="mr-2.5 text-muted-foreground">/</span>
				<h2 className="font-medium">{resume?.name}</h2>
				<Button size="icon" variant="ghost">
					<CaretDownIcon />
				</Button>
			</div>

			<Button size="icon" variant="ghost" onClick={toggleRightSidebar}>
				<SidebarSimpleIcon className="-scale-x-100" />
			</Button>
		</div>
	);
}
