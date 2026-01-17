import { access, constants as fsConstants, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import sharp from "sharp";
import { env } from "@/utils/env";

interface StorageWriteInput {
	key: string;
	data: Uint8Array;
	contentType: string;
}

interface StorageReadResult {
	data: Uint8Array;
	size: number;
	etag?: string;
	lastModified?: Date;
	contentType?: string;
}

interface StorageService {
	list(prefix: string): Promise<string[]>;
	write(input: StorageWriteInput): Promise<void>;
	read(key: string): Promise<StorageReadResult | null>;
	delete(key: string): Promise<boolean>;
	healthcheck(): Promise<StorageHealthResult>;
}

interface StorageHealthResult {
	status: "healthy" | "unhealthy";
	type: "local" | "s3";
	message: string;
	error?: string;
}

const CONTENT_TYPE_MAP: Record<string, string> = {
	".webp": "image/webp",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".pdf": "application/pdf",
};

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

const IMAGE_MIME_TYPES = ["image/gif", "image/png", "image/jpeg", "image/webp"];

// Key builders for different upload types
export function buildPictureKey(userId: string): string {
	const timestamp = Date.now();
	return `uploads/${userId}/pictures/${timestamp}.webp`;
}

export function buildScreenshotKey(userId: string, resumeId: string): string {
	const timestamp = Date.now();
	return `uploads/${userId}/screenshots/${resumeId}/${timestamp}.webp`;
}

export function buildPdfKey(userId: string, resumeId: string): string {
	const timestamp = Date.now();
	return `uploads/${userId}/pdfs/${resumeId}/${timestamp}.pdf`;
}

export function buildPublicUrl(path: string): string {
	return new URL(path, env.APP_URL).toString();
}

export function inferContentType(filename: string): string {
	const extension = extname(filename).toLowerCase();
	return CONTENT_TYPE_MAP[extension] ?? DEFAULT_CONTENT_TYPE;
}

export function isImageFile(mimeType: string): boolean {
	return IMAGE_MIME_TYPES.includes(mimeType);
}

export interface ProcessedImage {
	data: Uint8Array;
	contentType: string;
}

export async function processImageForUpload(file: File): Promise<ProcessedImage> {
	const fileBuffer = await file.arrayBuffer();

	const processedBuffer = await sharp(fileBuffer)
		.resize(800, 800, { fit: "inside", withoutEnlargement: true })
		.webp({ preset: "picture" })
		.toBuffer();

	return {
		data: new Uint8Array(processedBuffer),
		contentType: "image/webp",
	};
}

export class LocalStorageService implements StorageService {
	private rootDirectory: string;

	constructor() {
		this.rootDirectory = join(process.cwd(), "data");
	}

	async list(prefix: string): Promise<string[]> {
		const fullPath = this.resolvePath(prefix);

		try {
			const files = await readdir(fullPath, { recursive: true });

			return files.map((file) => join(prefix, file));
		} catch (error: unknown) {
			// If directory doesn't exist, return empty array
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
				return [];
			}

			throw error;
		}
	}

	async write({ key, data }: StorageWriteInput): Promise<void> {
		const fullPath = this.resolvePath(key);

		await mkdir(dirname(fullPath), { recursive: true });
		await Bun.write(fullPath, data);
	}

	async read(key: string): Promise<StorageReadResult | null> {
		const fullPath = this.resolvePath(key);
		const file = Bun.file(fullPath);

		if (!(await file.exists())) return null;

		const [arrayBuffer, stats] = await Promise.all([file.arrayBuffer(), file.stat()]);

		return {
			data: new Uint8Array(arrayBuffer),
			size: stats.size,
			etag: `"${stats.size}-${stats.mtime.getTime()}"`,
			lastModified: stats.mtime,
			contentType: inferContentType(key),
		};
	}

	async delete(key: string): Promise<boolean> {
		const fullPath = this.resolvePath(key);

		// Check if the path exists and whether it's a file or folder
		try {
			const stats = await Bun.file(fullPath).stat();

			if (stats.isDirectory()) {
				// Delete the directory and its contents recursively
				await rm(fullPath, { recursive: true });
				return true;
			} else {
				await Bun.file(fullPath).delete();
				return true;
			}
		} catch {
			// Path does not exist
			return false;
		}
	}

	async healthcheck(): Promise<StorageHealthResult> {
		try {
			await mkdir(this.rootDirectory, { recursive: true });
			await access(this.rootDirectory, fsConstants.R_OK | fsConstants.W_OK);

			return {
				type: "local",
				status: "healthy",
				message: "Local filesystem storage is accessible and has read/write permission.",
			};
		} catch (error: unknown) {
			return {
				type: "local",
				status: "unhealthy",
				message: "Local filesystem storage is not accessible or lacks sufficient permissions.",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	private resolvePath(key: string): string {
		const normalizedKey = key.replace(/^\/*/, "");
		const segments = normalizedKey
			.split(/[/\\]+/)
			.filter((segment) => segment.length > 0 && segment !== "." && segment !== "..");

		if (segments.length === 0) throw new Error("Invalid storage key");

		return join(this.rootDirectory, ...segments);
	}
}

class S3StorageService implements StorageService {
	private readonly client: Bun.S3Client;

	constructor() {
		this.client = new Bun.S3Client({
			bucket: env.S3_BUCKET,
			region: env.S3_REGION,
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
			endpoint: env.S3_ENDPOINT,
		});
	}

	async list(prefix: string): Promise<string[]> {
		const objects = await this.client.list({ prefix });
		if (!objects.contents) return [];
		return objects.contents.map((object) => object.key);
	}

	async write({ key, data, contentType }: StorageWriteInput): Promise<void> {
		await this.client.write(key, data, { type: contentType, acl: "public-read" });
	}

	async read(key: string): Promise<StorageReadResult | null> {
		const exists = await this.client.exists(key);

		if (!exists) return null;

		const [arrayBuffer, stats] = await Promise.all([this.client.file(key).arrayBuffer(), this.client.stat(key)]);

		return {
			data: new Uint8Array(arrayBuffer),
			size: stats.size,
			etag: stats.etag,
			lastModified: stats.lastModified,
			contentType: stats.type ?? inferContentType(key),
		};
	}

	async delete(keyOrPrefix: string): Promise<boolean> {
		// Use list to find all matching keys (handles both single file and folder/prefix)
		const keys = await this.list(keyOrPrefix);

		if (keys.length === 0) return false;

		// Delete all matching keys using Promise.allSettled
		const results = await Promise.allSettled(keys.map((k) => this.client.delete(k)));

		// Return true if at least one deletion succeeded
		return results.some((r) => r.status === "fulfilled");
	}

	async healthcheck(): Promise<StorageHealthResult> {
		try {
			await this.client.write("healthcheck", "OK");
			await this.client.delete("healthcheck");

			return {
				type: "s3",
				status: "healthy",
				message: "S3 storage is accessible and credentials are valid.",
			};
		} catch (error: unknown) {
			return {
				type: "s3",
				status: "unhealthy",
				message: "Failed to connect to S3 storage or invalid credentials.",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

function createStorageService(): StorageService {
	if (env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY && env.S3_BUCKET) {
		return new S3StorageService();
	}

	return new LocalStorageService();
}

let cachedService: StorageService | null = null;

export function getStorageService(): StorageService {
	if (cachedService) return cachedService;

	cachedService = createStorageService();
	return cachedService;
}

// High-level upload types
export type UploadType = "picture" | "screenshot" | "pdf";

export interface UploadFileInput {
	userId: string;
	data: Uint8Array;
	contentType: string;
	type: UploadType;
	resumeId?: string;
}

export interface UploadFileResult {
	url: string;
	key: string;
}

export async function uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
	const storageService = getStorageService();

	let key: string;

	switch (input.type) {
		case "picture":
			key = buildPictureKey(input.userId);
			break;
		case "screenshot":
			if (!input.resumeId) throw new Error("resumeId is required for screenshot uploads");
			key = buildScreenshotKey(input.userId, input.resumeId);
			break;
		case "pdf":
			if (!input.resumeId) throw new Error("resumeId is required for pdf uploads");
			key = buildPdfKey(input.userId, input.resumeId);
			break;
	}

	await storageService.write({
		key,
		data: input.data,
		contentType: input.contentType,
	});

	return {
		key,
		url: buildPublicUrl(key),
	};
}
