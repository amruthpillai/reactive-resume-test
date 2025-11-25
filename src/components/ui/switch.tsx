import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/style";

const switchRootVariants = cva(
	"peer inline-flex shrink-0 items-center rounded-full border border-transparent outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-border dark:data-[state=unchecked]:bg-border/80",
	{
		variants: {
			size: {
				sm: "h-[1.15rem] w-8",
				md: "h-6 w-10",
				lg: "h-7 w-12",
			},
		},
		defaultVariants: {
			size: "sm",
		},
	},
);

const switchThumbVariants = cva(
	"pointer-events-none block rounded-full bg-background ring-0 transition-transform dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
	{
		variants: {
			size: {
				sm: "size-4 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
				md: "size-5 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
				lg: "size-6 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
			},
		},
		defaultVariants: {
			size: "sm",
		},
	},
);

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchRootVariants>;

function Switch({ className, size = "sm", ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root data-slot="switch" className={cn(switchRootVariants({ size }), className)} {...props}>
			<SwitchPrimitive.Thumb data-slot="switch-thumb" className={cn(switchThumbVariants({ size }))} />
		</SwitchPrimitive.Root>
	);
}

export { Switch };
