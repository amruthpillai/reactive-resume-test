import { useMemo } from "react";
import { cn } from "@/utils/style";
import { Combobox, type ComboboxProps } from "../ui/combobox";
import { MultipleCombobox, type MultipleComboboxProps } from "../ui/multiple-combobox";
import { FontDisplay } from "./font-display";
import type { WebFont } from "./types";
import webFontListJSON from "./webfontlist.json";

const webFontList = webFontListJSON as WebFont[];

function buildWebFontMap() {
	const webFontMap = new Map<string, WebFont>();

	for (const font of webFontList) {
		webFontMap.set(font.family, font);
	}

	return webFontMap;
}

const webFontMap: Map<string, WebFont> = buildWebFontMap();

type FontFamilyComboboxProps = Omit<ComboboxProps, "options">;

export function FontFamilyCombobox({ className, ...props }: FontFamilyComboboxProps) {
	const options = useMemo(() => {
		return webFontList.map((font) => ({
			value: font.family,
			keywords: [font.family],
			label: <FontDisplay name={font.family} url={font.preview} />,
		}));
	}, []);

	return <Combobox options={options} className={cn("w-full", className)} {...props} />;
}

type FontWeightComboboxProps = Omit<MultipleComboboxProps, "options"> & { fontFamily: string };

export function FontWeightCombobox({ fontFamily, ...props }: FontWeightComboboxProps) {
	const options = useMemo(() => {
		const fontData = webFontMap.get(fontFamily);
		if (!fontData || !Array.isArray(fontData.weights)) return [];

		return fontData.weights.map((variant: string) => ({
			value: variant,
			label: variant,
			keywords: [variant],
		}));
	}, [fontFamily]);

	return <MultipleCombobox options={options} {...props} />;
}
