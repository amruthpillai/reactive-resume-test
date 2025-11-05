import { useMemo } from "react";
import { cn } from "@/utils/style";
import { useTheme } from "../theme/provider";

type Props = React.ComponentProps<"img"> & {
	variant?: "logo" | "icon";
};

export function BrandIcon({ variant = "logo", className, ...props }: Props) {
	const { theme } = useTheme();

	const imageSource = useMemo(() => {
		return `/${variant}/${theme}.svg`;
	}, [theme, variant]);

	return <img src={imageSource} alt="Reactive Resume" className={cn("size-12", className)} {...props} />;
}
