import z from "zod";
import { protectedProcedure, publicProcedure } from "../context";
import { printerService } from "../services/printer";
import { resumeService } from "../services/resume";

export const printerRouter = {
	printResumeAsPDF: publicProcedure
		.route({
			method: "GET",
			path: "/printer/resume/{id}/pdf",
			tags: ["Resume", "Printer"],
			summary: "Export resume as PDF",
			description: "Export a resume as a PDF.",
		})
		.input(z.object({ id: z.string() }))
		.output(z.instanceof(File))
		.handler(async ({ input, context }) => {
			const file = await printerService.printResumeAsPDF({ id: input.id });

			if (!context.user) {
				await resumeService.statistics.increment({ id: input.id, downloads: true });
			}

			return file;
		}),

	getResumeScreenshot: protectedProcedure
		.route({
			method: "GET",
			path: "/printer/resume/{id}/screenshot",
			tags: ["Resume", "Printer"],
			summary: "Get resume screenshot",
			description: "Get a screenshot of a resume.",
		})
		.input(z.object({ id: z.string() }))
		.output(z.instanceof(File))
		.handler(async ({ input }) => {
			return await printerService.getResumeScreenshot({ id: input.id });
		}),
};
