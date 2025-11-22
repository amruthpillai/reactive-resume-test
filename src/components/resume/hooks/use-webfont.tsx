import { useEffect } from "react";
import webfontlist from "@/components/typography/webfontlist.json";
import type { ResumeData } from "@/schema/resume/data";

export function useWebfontLoader(data: ResumeData) {
	useEffect(() => {
		async function loadFont(family: string, weights: string[]) {
			const font = webfontlist.find((font) => font.family === family);
			if (!font) return;

			type FontUrl = { url: string; weight: string; style: "italic" | "normal" };

			const fontUrls: FontUrl[] = [];

			for (const weight of weights) {
				for (const [fileWeight, url] of Object.entries(font.files)) {
					if (weight === fileWeight) {
						fontUrls.push({ url, weight, style: "normal" });
					}
					if (fileWeight === `${weight}italic`) {
						fontUrls.push({ url, weight, style: "italic" });
					}
				}
			}

			for (const { url, weight, style } of fontUrls) {
				const fontFace = new FontFace(family, `url("${url}")`, { style, weight, display: "swap" });
				if (!document.fonts.has(fontFace)) document.fonts.add(await fontFace.load());
			}
		}

		const bodyTypography = data.metadata.typography.body;
		const headingTypography = data.metadata.typography.heading;

		Promise.all([
			loadFont(bodyTypography.fontFamily, bodyTypography.fontWeights),
			loadFont(headingTypography.fontFamily, headingTypography.fontWeights),
		]);
	}, [data.metadata.typography]);
}
