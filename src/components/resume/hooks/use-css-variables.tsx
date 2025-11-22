import { useMemo } from "react";
import type { ResumeData } from "@/schema/resume/data";

const pageDimensions = {
	a4: {
		width: "210mm",
		height: "297mm",
	},
	letter: {
		width: "216mm",
		height: "279mm",
	},
} as const;

export const useCSSVariables = (data: ResumeData) => {
	const fontWeightStyles = useMemo(() => {
		const lowestBodyFontWeight = Math.min(...data.metadata.typography.body.fontWeights.map(Number));
		const lowestHeadingFontWeight = Math.min(...data.metadata.typography.heading.fontWeights.map(Number));

		return { lowestBodyFontWeight, lowestHeadingFontWeight };
	}, [data.metadata.typography.body.fontWeights, data.metadata.typography.heading.fontWeights]);

	return {
		"--page-width": pageDimensions[data.metadata.page.format].width,
		"--page-height": pageDimensions[data.metadata.page.format].height,
		"--page-sidebar-width": `${data.metadata.layout.sidebarWidth}%`,
		"--page-text-color": data.metadata.design.colors.text,
		"--page-primary-color": data.metadata.design.colors.primary,
		"--page-background-color": data.metadata.design.colors.background,
		"--page-body-font-family": `'${data.metadata.typography.body.fontFamily}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
		"--page-body-font-weight": fontWeightStyles.lowestBodyFontWeight,
		"--page-body-font-size": data.metadata.typography.body.fontSize,
		"--page-body-line-height": data.metadata.typography.body.lineHeight,
		"--page-heading-font-family": `'${data.metadata.typography.heading.fontFamily}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
		"--page-heading-font-weight": fontWeightStyles.lowestHeadingFontWeight,
		"--page-heading-font-size": data.metadata.typography.heading.fontSize,
		"--page-heading-line-height": data.metadata.typography.heading.lineHeight,
		"--page-margin-x": `${data.metadata.page.marginX}pt`,
		"--page-margin-y": `${data.metadata.page.marginY}pt`,
	} as React.CSSProperties;
};
