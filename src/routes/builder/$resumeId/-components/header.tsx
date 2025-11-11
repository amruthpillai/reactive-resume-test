import { CaretDownIcon, HouseSimpleIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useBuilderSidebar } from "../-context/builder";
import { useResumeStore } from "../-store/resume";

export function BuilderHeader() {
	const resume = useResumeStore((state) => state.resume);
	const { toggleLeftSidebar, toggleRightSidebar } = useBuilderSidebar();

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
