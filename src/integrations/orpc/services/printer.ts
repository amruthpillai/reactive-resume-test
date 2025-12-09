import { ORPCError } from "@orpc/server";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { resumeService } from "./resume";

const pageDimensions = {
	a4: {
		width: "210mm",
		height: "297mm",
	},
	letter: {
		width: "8.5in",
		height: "11in",
	},
} as const;

export const printerService = {
	printResumeAsPDF: async (input: { id: string }): Promise<File> => {
		const resume = await resumeService.getByIdForPrinter({ id: input.id });
		const pageFormat = resume.data.metadata.page.format;

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();

		formData.append("url", url);
		formData.append("marginTop", "0");
		formData.append("marginLeft", "0");
		formData.append("marginRight", "0");
		formData.append("marginBottom", "0");
		formData.append("printBackground", "true");
		formData.append("skipNetworkIdleEvent", "false");
		formData.append("paperWidth", pageDimensions[pageFormat].width);
		formData.append("paperHeight", pageDimensions[pageFormat].height);

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/convert/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const pdfBuffer = await response.arrayBuffer();
		return new File([new Uint8Array(pdfBuffer)], `resume-${input.id}.pdf`, { type: "application/pdf" });
	},

	getResumeScreenshot: async (input: { id: string }): Promise<File> => {
		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();

		formData.append("url", url);
		formData.append("clip", "true");
		formData.append("width", "794");
		formData.append("height", "1123");
		formData.append("format", "webp");
		formData.append("optimizeForSpeed", "true");
		formData.append("skipNetworkIdleEvent", "false");

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/screenshot/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const imageBuffer = await response.arrayBuffer();
		return new File([new Uint8Array(imageBuffer)], `resume-${input.id}.webp`, { type: "image/webp" });
	},
};
