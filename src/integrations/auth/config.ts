import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { username } from "better-auth/plugins/username";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/integrations/drizzle/client";
import { env } from "@/utils/env";
import { generateId, toUsername } from "@/utils/string";
import { schema } from "../drizzle";

const getAuthServerFn = createServerOnlyFn(() => {
	return betterAuth({
		appName: "Reactive Resume",
		secret: env.AUTH_SECRET,

		database: drizzleAdapter(db, { schema, provider: "pg" }),

		telemetry: { enabled: false },
		advanced: {
			database: { generateId },
			useSecureCookies: env.APP_URL.startsWith("https://"),
		},

		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
			minPasswordLength: 6,
			maxPasswordLength: 64,
			requireEmailVerification: false,
			disableSignUp: env.FLAG_DISABLE_SIGNUP,
			sendResetPassword: async ({ user, url }) => {
				console.log(`[EMAIL] [${user.email}] To reset your password, please visit the following URL: ${url}`);
			},
			password: {
				hash: (password) => Bun.password.hash(password),
				verify: ({ password, hash }) => Bun.password.verify(password, hash),
			},
		},

		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				console.log(`[EMAIL] [${user.email}] To verify your email, please visit the following URL: ${url}`);
			},
		},

		user: {
			changeEmail: {
				enabled: true,
				sendChangeEmailVerification: async ({ user, newEmail, url }) => {
					console.log(
						`[EMAIL] [${user.email}] To change your email to ${newEmail}, please visit the following URL: ${url}`,
					);
				},
			},
			additionalFields: {
				username: {
					type: "string",
					required: true,
				},
			},
		},

		socialProviders: {
			google: {
				enabled: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientId: env.GOOGLE_CLIENT_ID!,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientSecret: env.GOOGLE_CLIENT_SECRET!,
				mapProfileToUser: async (profile) => {
					return {
						name: profile.name,
						email: profile.email,
						image: profile.picture,
						username: profile.email.split("@")[0],
						displayUsername: profile.email.split("@")[0],
						emailVerified: true,
					};
				},
			},

			github: {
				enabled: !!env.GITHUB_CLIENT_ID && !!env.GITHUB_CLIENT_SECRET,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientId: env.GITHUB_CLIENT_ID!,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientSecret: env.GITHUB_CLIENT_SECRET!,
				mapProfileToUser: async (profile) => {
					return {
						name: profile.name,
						email: profile.email,
						image: profile.avatar_url,
						username: profile.login,
						displayUsername: profile.login,
						emailVerified: true,
					};
				},
			},
		},

		plugins: [
			username({
				minUsernameLength: 3,
				maxUsernameLength: 64,
				usernameNormalization: (value) => toUsername(value),
				displayUsernameNormalization: (value) => toUsername(value),
				validationOrder: { username: "post-normalization", displayUsername: "post-normalization" },
			}),
			twoFactor({ issuer: "Reactive Resume" }),
			passkey({ rpName: "Reactive Resume", rpID: "localhost" }),
			reactStartCookies(),
		],
	});
});

export const auth = getAuthServerFn();
