import { CircleNotchIcon } from "@phosphor-icons/react";

import { cn } from "@/utils/style";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return <CircleNotchIcon role="status" aria-label="Loading" className={cn("animate-spin", className)} {...props} />;
}

export { Spinner };
