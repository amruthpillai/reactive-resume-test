import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields, twoFactorClient, usernameClient } from "better-auth/client/plugins";
import type { auth } from "./config";

export const authClient = createAuthClient({
	plugins: [
		usernameClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				// Redirect to 2FA verification page
				if (typeof window !== "undefined") {
					window.location.href = "/auth/verify-2fa";
				}
			},
		}),
		inferAdditionalFields<typeof auth>(),
	],
});
