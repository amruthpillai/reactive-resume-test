import { ORPCError } from "@orpc/client";
import slugify from "@sindresorhus/slugify";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { defaultResumeData, resumeDataSchema } from "@/schema/resume/data";
import { protectedProcedure } from "../context";

export const resumeRouter = {
	list: protectedProcedure.handler(({ context }) => {
		return db
			.select({
				id: schema.resume.id,
				name: schema.resume.name,
				slug: schema.resume.slug,
				tags: schema.resume.tags,
				isPublic: schema.resume.isPublic,
				isLocked: schema.resume.isLocked,
				createdAt: schema.resume.createdAt,
				updatedAt: schema.resume.updatedAt,
			})
			.from(schema.resume)
			.where(eq(schema.resume.userId, context.user.id))
			.orderBy(desc(schema.resume.updatedAt));
	}),

	getById: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		const resume = await db.query.resume.findFirst({
			where: and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)),
		});

		if (!resume) throw new ORPCError("NOT_FOUND");

		return resume;
	}),

	create: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				name: z.string().trim().min(1).max(64),
				slug: z
					.string()
					.trim()
					.min(1)
					.max(64)
					.transform((value) => slugify(value)),
				tags: z.array(z.string().trim().min(1).max(64)),
			}),
		)
		.handler(async ({ context, input }) => {
			await db.insert(schema.resume).values({
				name: input.name,
				slug: input.slug,
				tags: input.tags,
				userId: context.user.id,
				data: defaultResumeData,
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().trim().min(1).max(64),
				slug: z
					.string()
					.trim()
					.min(1)
					.max(64)
					.transform((value) => slugify(value)),
				tags: z.array(z.string().trim().min(1).max(64)),
			}),
		)
		.handler(async ({ context, input }) => {
			await db
				.update(schema.resume)
				.set({ name: input.name, slug: input.slug, tags: input.tags })
				.where(
					and(
						eq(schema.resume.id, input.id),
						eq(schema.resume.isLocked, false),
						eq(schema.resume.userId, context.user.id),
					),
				);
		}),

	updateData: protectedProcedure
		.input(z.object({ id: z.string(), data: resumeDataSchema }))
		.handler(async ({ context, input }) => {
			await db
				.update(schema.resume)
				.set({ data: input.data })
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));
		}),

	setLocked: protectedProcedure
		.input(z.object({ id: z.string(), isLocked: z.boolean() }))
		.handler(async ({ context, input }) => {
			await db
				.update(schema.resume)
				.set({ isLocked: input.isLocked })
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));
		}),

	delete: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		await db
			.delete(schema.resume)
			.where(
				and(
					eq(schema.resume.id, input.id),
					eq(schema.resume.isLocked, false),
					eq(schema.resume.userId, context.user.id),
				),
			);
	}),
};
