import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { useTheme } from "./provider";

export function ThemeToggleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button variant="ghost" onClick={toggleTheme} className={className} {...props}>
			{theme === "dark" ? <MoonIcon /> : <SunIcon />}
		</Button>
	);
}
