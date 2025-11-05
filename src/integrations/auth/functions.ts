import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./config";

export const getSessionServerFn = createServerFn().handler(async () => {
	const session = await auth.api.getSession({ headers: getRequestHeaders() });

	return session;
});
