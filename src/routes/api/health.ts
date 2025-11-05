import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { db } from "@/integrations/drizzle/client";

async function handler(_: { request: Request }) {
	const checks = {
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		version: process.env.npm_package_version,
		database: await checkDatabase(),
	};

	return json(checks);
}

async function checkDatabase() {
	try {
		await db.execute(sql`SELECT 1`);
		return { status: "connected" };
	} catch (error) {
		return { status: "error", error: error instanceof Error ? error.message : "Unknown error" };
	}
}

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			GET: handler,
		},
	},
});
