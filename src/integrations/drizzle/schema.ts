import { boolean, index, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { defaultResumeData, type ResumeData } from "@/schema/resume";
import { generateId } from "@/utils/string";

export const user = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	image: text("image"),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	username: text("username").notNull().unique(),
	displayUsername: text("display_username").notNull().unique(),
	twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const session = pgTable(
	"session",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.token, t.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull().default("credential"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		scope: text("scope"),
		idToken: text("id_token"),
		password: text("password"),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.userId)],
);

export const verification = pgTable("verification", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	identifier: text("identifier").notNull().unique(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const resume = pgTable(
	"resume",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		isPublic: boolean("is_public").notNull().default(false),
		isLocked: boolean("is_locked").notNull().default(false),
		data: jsonb("data")
			.notNull()
			.$type<ResumeData>()
			.$defaultFn(() => defaultResumeData),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [unique().on(t.slug, t.userId)],
);

export const twoFactor = pgTable(
	"two_factor",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		secret: text("secret"),
		backupCodes: text("backup_codes"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.userId)],
);
