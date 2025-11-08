import { ScrollArea } from "@/components/ui/scroll-area";
import { BuilderSidebarEdge } from "../edge";

export function BuilderSidebarRight() {
	return (
		<>
			<BuilderSidebarEdge side="right">
				<div />

				<div />

				<div />
			</BuilderSidebarEdge>

			<ScrollArea className="h-full sm:mr-12">
				<div className="flex flex-col space-y-4 p-4">
					<p>Right Sidebar</p>

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
