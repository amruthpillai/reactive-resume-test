import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

type Size = "default" | "sm" | "lg";
type DynamicSize = Size | (string & {});

const sizes: DynamicSize[] = ["default", "sm", "lg"];

const hitboxVariants = cva(
	"relative [--size-default:12px] [--size-lg:16px] [--size-sm:8px] after:absolute after:content-['']",
	{
		variants: {
			size: {
				default: "[--size:var(--size-default)]",
				sm: "[--size:var(--size-sm)]",
				lg: "[--size:var(--size-lg)]",
				dynamic: "[--size:var(--size)]",
			},
			position: {
				all: "after:inset-[calc(-1*var(--size))]",
				top: "after:top-[calc(-1*var(--size))] after:right-0 after:left-0 after:h-(--size)",
				bottom: "after:right-0 after:bottom-[calc(-1*var(--size))] after:left-0 after:h-(--size)",
				left: "after:top-0 after:bottom-0 after:left-[calc(-1*var(--size))] after:w-(--size)",
				right: "after:top-0 after:right-[calc(-1*var(--size))] after:bottom-0 after:w-(--size)",
				vertical: "after:top-[calc(-1*var(--size))] after:right-0 after:bottom-[calc(-1*var(--size))] after:left-0",
				horizontal: "after:top-0 after:right-[calc(-1*var(--size))] after:bottom-0 after:left-[calc(-1*var(--size))]",
			},
			radius: {
				none: "",
				sm: "after:rounded-sm",
				md: "after:rounded-md",
				lg: "after:rounded-lg",
				full: "after:rounded-full",
			},
			debug: {
				true: "after:border after:border-red-500 after:border-dashed after:bg-red-500/20",
				false: "",
			},
		},
		defaultVariants: {
			size: "default",
			position: "all",
			radius: "none",
			debug: false,
		},
	},
);

interface HitboxProps extends React.ComponentProps<typeof Slot>, Omit<VariantProps<typeof hitboxVariants>, "size"> {
	size?: DynamicSize;
}

export function Hitbox(props: HitboxProps) {
	const { className, style, size, position, radius, debug = false, ...hitboxProps } = props;

	const isDynamicSize = size && !sizes.includes(size);

	return (
		<Slot
			{...hitboxProps}
			className={cn(
				hitboxVariants({
					size: isDynamicSize ? "dynamic" : (size as Size),
					position,
					radius,
					debug,
				}),
				className,
			)}
			style={{
				...(isDynamicSize && { "--size": size }),
				...style,
			}}
		/>
	);
}
