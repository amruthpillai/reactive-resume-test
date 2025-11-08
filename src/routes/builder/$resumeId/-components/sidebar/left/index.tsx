import { useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../edge";
import { BasicsSectionBuilder } from "./sections/basics";
import { ProfilesSectionBuilder } from "./sections/profiles";
import { SummarySectionBuilder } from "./sections/summary";

export function BuilderSidebarLeft() {
	const { session } = useRouteContext({ from: "/builder/$resumeId" });

	return (
		<>
			<BuilderSidebarEdge side="left">
				<div />

				<div />

				<UserDropdownMenu>
					<Button size="icon" variant="ghost">
						<Avatar className="size-6">
							<AvatarImage src={session.user.image ?? undefined} />
							<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
						</Avatar>
					</Button>
				</UserDropdownMenu>
			</BuilderSidebarEdge>

			<ScrollArea className="h-full sm:ml-12">
				<div className="flex flex-col space-y-4 p-4">
					<BasicsSectionBuilder />
					<Separator />
					<SummarySectionBuilder />
					<Separator />
					<ProfilesSectionBuilder />
				</div>
			</ScrollArea>
		</>
	);
}
