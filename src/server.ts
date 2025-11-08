import handler, { type ServerEntry } from "@tanstack/react-start/server-entry";
import { migrateDatabase } from "@/scripts/database/migrate";

await migrateDatabase();

export default {
	fetch(request) {
		return handler.fetch(request);
	},
} satisfies ServerEntry;
