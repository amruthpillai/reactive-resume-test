import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_URL, "DATABASE_URL is not set");

export default defineConfig({
	out: "./migrations",
	schema: "./src/integrations/drizzle/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
