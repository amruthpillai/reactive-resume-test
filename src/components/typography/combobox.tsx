import { useMemo } from "react";
import { cn } from "@/utils/style";
import { Combobox, type ComboboxProps } from "../ui/combobox";
import { MultipleCombobox, type MultipleComboboxProps } from "../ui/multiple-combobox";
import { FontDisplay } from "./font-display";
import webfontlist from "./webfontlist.json";

type WebFont = (typeof webfontlist)[number];

function getFontFamilyMap() {
	const map = new Map<string, WebFont>();

	for (const font of webfontlist) {
		map.set(font.family, font);
	}

	return map;
}

const fontFamilyMap: Map<string, WebFont> = getFontFamilyMap();

type FontFamilyComboboxProps = Omit<ComboboxProps, "options">;

export function FontFamilyCombobox({ className, ...props }: FontFamilyComboboxProps) {
	const options = useMemo(() => {
		return webfontlist.map((font) => ({
			value: font.family,
			keywords: [font.family],
			label: <FontDisplay name={font.family} url={font.preview} />,
		}));
	}, []);

	return <Combobox options={options} className={cn("w-full", className)} {...props} />;
}

type FontSubsetsComboboxProps = Omit<MultipleComboboxProps, "options"> & { fontFamily: string };

export function FontSubsetsCombobox({ fontFamily, ...props }: FontSubsetsComboboxProps) {
	const options = useMemo(() => {
		const fontData = fontFamilyMap.get(fontFamily);
		if (!fontData || !Array.isArray(fontData.subsets)) return [];

		return fontData.subsets.map((subset: string) => ({
			value: subset,
			label: subset,
			keywords: [subset],
		}));
	}, [fontFamily]);

	return <MultipleCombobox options={options} {...props} />;
}

type FontVariantsComboboxProps = Omit<MultipleComboboxProps, "options"> & { fontFamily: string };

export function FontVariantsCombobox({ fontFamily, ...props }: FontVariantsComboboxProps) {
	const options = useMemo(() => {
		const fontData = fontFamilyMap.get(fontFamily);
		if (!fontData || !Array.isArray(fontData.variants)) return [];

		return fontData.variants.map((variant: string) => ({
			value: variant,
			label: variant,
			keywords: [variant],
		}));
	}, [fontFamily]);

	return <MultipleCombobox options={options} {...props} />;
}
