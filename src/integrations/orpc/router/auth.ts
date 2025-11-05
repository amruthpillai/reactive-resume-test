import { eq } from "drizzle-orm";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { env } from "@/utils/env";
import { protectedProcedure, publicProcedure } from "../context";

export const authRouter = {
	listProviders: publicProcedure.handler(async () => {
		const providers = ["credential"];

		if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) providers.push("google");
		if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) providers.push("github");

		return providers;
	}),

	deleteAccount: protectedProcedure.handler(async ({ context }) => {
		await db.delete(schema.user).where(eq(schema.user.id, context.user.id));
	}),
};
