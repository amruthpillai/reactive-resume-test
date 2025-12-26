import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { env } from "@/utils/env";

export async function migrateDatabase() {
	console.log("⌛ Running database migrations...");

	const db = drizzle(env.DATABASE_URL);

	try {
		await migrate(db, { migrationsFolder: "./migrations" });
		console.log("✅ Database migrations completed");
	} catch (error) {
		console.error("🚨 Database migrations failed:", error);
	}
}

if (import.meta.main) {
	await migrateDatabase();
}
