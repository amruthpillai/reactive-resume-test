import { ORPCError, os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { auth } from "../auth/config";

interface ORPCContext extends RequestHeadersPluginContext {}

export const publicProcedure = os.$context<ORPCContext>();

export const authMiddleware = publicProcedure.middleware(async ({ context, next }) => {
	const headers = context.reqHeaders ?? new Headers();

	const result = await auth.api.getSession({ headers });

	if (!result || !result.session || !result.user) throw new ORPCError("UNAUTHORIZED");

	return next({
		context: {
			session: result.session,
			user: result.user,
		},
	});
});

export const protectedProcedure = publicProcedure.use(authMiddleware);
