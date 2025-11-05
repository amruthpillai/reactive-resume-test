import Tilt from "react-parallax-tilt";
import { cn } from "@/utils/style";

type BaseCardProps = React.ComponentProps<"div"> & {
	title: string;
	description: string;
	className?: string;
	children?: React.ReactNode;
};

export function BaseCard({ title, description, className, children, ...props }: BaseCardProps) {
	return (
		<Tilt>
			<div
				{...props}
				className={cn(
					"relative flex aspect-page size-full cursor-pointer overflow-hidden rounded-md bg-popover shadow",
					className,
				)}
			>
				{children}

				<div className="absolute inset-x-0 bottom-0 flex w-full flex-col justify-end space-y-0.5 bg-linear-to-b from-transparent to-background/80 p-4 pt-8">
					<h3 className="truncate font-medium tracking-tight">{title}</h3>
					<p className="truncate text-muted-foreground text-xs">{description}</p>
				</div>
			</div>
		</Tilt>
	);
}
