import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,

	client: {},

	server: {
		// Basics
		APP_URL: z.url({ protocol: /https?/ }).default("http://localhost:3000"),

		// Authentication
		AUTH_SECRET: z.string().min(1),

		// Database
		DATABASE_URL: z.url({ protocol: /postgres(ql)?/ }),

		// Social Auth (Google)
		GOOGLE_CLIENT_ID: z.string().min(1).optional(),
		GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

		// Social Auth (GitHub)
		GITHUB_CLIENT_ID: z.string().min(1).optional(),
		GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

		// Feature Flags
		FLAG_DISABLE_SIGNUP: z.stringbool().default(false),
	},
});
