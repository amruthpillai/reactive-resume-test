import { CheckIcon } from "@phosphor-icons/react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/utils/style";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"peer size-4 shrink-0 rounded-md border outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary dark:aria-invalid:ring-destructive/40",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current">
				<CheckIcon className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
