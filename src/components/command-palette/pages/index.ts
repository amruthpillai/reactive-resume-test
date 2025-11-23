import type { ComponentType } from "react";
import { BuilderAddSectionCommandPage } from "./builder/add-section";
import { HomeCommandPage } from "./home";
import { LanguageCommandPage } from "./preferences/language";
import { ThemeCommandPage } from "./preferences/theme";
import { ResumesCommandPage } from "./resumes";

export type CommandKPage = "home" | "resumes" | "theme" | "language" | "add-section";

export const commandKPages: Record<CommandKPage, ComponentType> = {
	home: HomeCommandPage,
	resumes: ResumesCommandPage,
	theme: ThemeCommandPage,
	language: LanguageCommandPage,
	"add-section": BuilderAddSectionCommandPage,
};
