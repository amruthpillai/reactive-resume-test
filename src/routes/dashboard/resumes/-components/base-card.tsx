import Tilt from "react-parallax-tilt";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type BaseCardProps = React.ComponentProps<"div"> & {
	title: string;
	description: string;
	tags?: string[];
	className?: string;
	children?: React.ReactNode;
};

export function BaseCard({ title, description, tags, className, children, ...props }: BaseCardProps) {
	return (
		<Tilt>
			<div
				{...props}
				className={cn(
					"relative flex aspect-page size-full cursor-pointer overflow-hidden rounded-md bg-popover",
					className,
				)}
			>
				{children}

				<div className="absolute inset-x-0 bottom-0 flex w-full flex-col justify-end space-y-0.5 bg-background/40 px-4 py-3 backdrop-blur-xs">
					<h3 className="truncate font-medium tracking-tight">{title}</h3>
					<p className="truncate text-xs opacity-80">{description}</p>

					<div className={cn("mt-2 hidden flex-wrap items-center gap-1", tags && tags.length > 0 && "flex")}>
						{tags?.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</div>
		</Tilt>
	);
}
