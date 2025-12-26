import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/bun-sql";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql/postgres/driver";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";

declare global {
	var __drizzleClient: BunSQLDatabase<typeof schema> | undefined;
}

function makeDrizzleClient() {
	return drizzle(env.DATABASE_URL, { schema });
}

const getDatabaseServerFn = createServerOnlyFn(() => {
	const db = globalThis.__drizzleClient ?? makeDrizzleClient();
	globalThis.__drizzleClient = db;

	return db;
});

export const db = getDatabaseServerFn();
