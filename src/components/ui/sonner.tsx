import { CheckCircleIcon, CircleNotchIcon, InfoIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "../theme/provider";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme();

	return (
		<Sonner
			className="toaster group"
			theme={theme as ToasterProps["theme"]}
			toastOptions={{ className: "select-none" }}
			icons={{
				info: <InfoIcon />,
				warning: <WarningIcon />,
				success: <CheckCircleIcon />,
				error: <WarningOctagonIcon />,
				loading: <CircleNotchIcon className="animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius-md)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
