import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en-US",
	locales: ["en-US", "de-DE"],
	fallbackLocales: { default: "en-US" },
	catalogs: [
		{
			path: "<rootDir>/locales/{locale}",
			include: ["src"],
		},
	],
});
