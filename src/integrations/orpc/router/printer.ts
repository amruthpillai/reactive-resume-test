import { ORPCError } from "@orpc/server";
import puppeteer from "puppeteer-core";
import z from "zod";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { publicProcedure } from "../context";
import { resumeService } from "../services/resume";

export const printerRouter = {
	printResumeAsPDF: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }): Promise<File> => {
		const resume = await resumeService.getByIdForPrinter({ id: input.id });
		const pageFormat = resume.data.metadata.page.format;

		const browser = await puppeteer.connect({
			browserWSEndpoint: env.PRINTER_ENDPOINT,
			defaultViewport: { width: 794, height: 1123 },
		});

		try {
			const token = generatePrinterToken(input.id);

			const page = await browser.newPage();

			const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;
			await page.goto(`${baseUrl}/printer/${input.id}?token=${token}`, { waitUntil: "networkidle0", timeout: 25000 });

			const pdfBuffer = await page.pdf({
				format: pageFormat,
				printBackground: true,
			});

			await page.close();

			return new File([new Uint8Array(pdfBuffer)], `resume-${input.id}.pdf`, { type: "application/pdf" });
		} catch (error) {
			console.error(error);

			throw new ORPCError("INTERNAL_SERVER_ERROR");
		} finally {
			await browser.disconnect();
		}
	}),
};
