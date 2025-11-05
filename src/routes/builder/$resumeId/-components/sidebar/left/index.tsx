import { Link, useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../edge";

export function BuilderSidebarLeft() {
	const { session } = useRouteContext({ from: "/builder/$resumeId" });

	return (
		<>
			<BuilderSidebarEdge side="left">
				<Button asChild size="icon" variant="ghost">
					<Link to="/dashboard/resumes">
						<BrandIcon variant="icon" className="size-4" />
					</Link>
				</Button>

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

			<ScrollArea className="h-svh sm:ml-12">
				<div className="flex flex-col space-y-4 p-4">
					{Array.from({ length: 10 }).map((_, index) => (
						<p key={index} className="text-justify">
							Esse ea velit laboris amet duis ex aliqua aliquip pariatur est excepteur fugiat. Non ut velit proident
							reprehenderit non ullamco. Officia ut est laboris eiusmod tempor non exercitation id cillum officia. Sit
							cupidatat tempor tempor dolore ipsum sint consequat nostrud adipisicing velit ut pariatur elit quis. Nulla
							non non fugiat ex dolore est esse. Dolore consequat sunt aute ea pariatur laboris deserunt ullamco
							exercitation nisi amet. Ex commodo minim Lorem ipsum. Ullamco pariatur deserunt elit anim mollit culpa
							occaecat proident commodo ut duis anim.
						</p>
					))}
				</div>
			</ScrollArea>
		</>
	);
}
