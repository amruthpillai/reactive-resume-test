import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en-US",
	pseudoLocale: "zu-ZA",
	locales: ["en-US", "de-DE", "zu-ZA"],
	fallbackLocales: { "zu-ZA": "en-US", default: "en-US" },
	catalogs: [
		{
			path: "<rootDir>/locales/{locale}",
			include: ["src"],
		},
	],
});
