import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use } from "react";
import { setThemeServerFn, type Theme } from "@/utils/theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (value: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = PropsWithChildren<{ theme: Theme }>;

export function ThemeProvider({ children, theme }: Props) {
	const router = useRouter();

	async function setTheme(value: Theme) {
		document.documentElement.classList.toggle("dark", value === "dark");
		await setThemeServerFn({ data: value });
		router.invalidate();

		try {
			const soundClip = value === "dark" ? "/sounds/switch-off.mp3" : "/sounds/switch-on.mp3";
			const audio = new Audio(soundClip);
			await audio.play();
		} catch {
			// ignore errors
		}
	}

	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	return <ThemeContext value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
	const value = use(ThemeContext);

	if (!value) throw new Error("useTheme must be used within a ThemeProvider");

	return value;
}
