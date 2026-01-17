import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";
import { generateId } from "@/utils/string";

export async function seedDatabase() {
	console.log("⌛ Seeding database...");

	const db = drizzle(env.DATABASE_URL, { schema });

	try {
		const userId = generateId();

		await db.insert(schema.user).values({
			id: userId,
			name: "Test User",
			email: "test@test.com",
			username: "test",
			displayUsername: "test",
			emailVerified: true,
			image: "https://i.pravatar.cc/300",
		});

		await db.insert(schema.account).values({
			id: generateId(),
			userId,
			accountId: userId,
			password: await Bun.password.hash("password", "bcrypt"),
		});
	} catch (error) {
		console.error("🚨 Database seeding failed:", error);
	}
}

if (import.meta.main) {
	await seedDatabase();
}
