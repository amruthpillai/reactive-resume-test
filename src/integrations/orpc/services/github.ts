import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const GITHUB_API_URL = "https://api.github.com/repos/AmruthPillai/Reactive-Resume";
const GITHUB_STARS_CACHE_FILE = join(process.cwd(), "data", "github", "stars.txt");
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
const LAST_KNOWN_STARS_COUNT = 34_073;

/**
 * Reads and validates cached star count.
 */
const readStarCountFromCache = async (): Promise<number | null> => {
	try {
		const stats = await stat(GITHUB_STARS_CACHE_FILE);
		const contents = await readFile(GITHUB_STARS_CACHE_FILE, "utf-8");

		if (stats.mtimeMs < Date.now() - CACHE_DURATION_MS) return null;

		const numStars = Number.parseInt(contents, 10);
		return Number.isFinite(numStars) && numStars > 0 ? numStars : null;
	} catch {
		return null;
	}
};

/**
 * Writes the star count to cache as string, fire-and-forget with minimal error handling.
 */
const writeStarCountToCache = async (count: number) => {
	try {
		await mkdir(dirname(GITHUB_STARS_CACHE_FILE), { recursive: true });
		await writeFile(GITHUB_STARS_CACHE_FILE, String(count), "utf-8");
	} catch {
		// Ignore errors, cache is not critical
	}
};

export const githubService = {
	getStarCount: async (): Promise<number> => {
		// Try cache first
		const cached = await readStarCountFromCache();
		if (cached !== null) return cached;

		let stars = LAST_KNOWN_STARS_COUNT;

		// Fallback to API if cache is stale
		try {
			const response = await fetch(GITHUB_API_URL, { headers: { Accept: "application/vnd.github+json" } });

			if (response.ok) {
				const data = await response.json();
				const apiStars = Number(data.stargazers_count);

				if (Number.isFinite(apiStars) && apiStars > 0) {
					stars = apiStars;
					await writeStarCountToCache(apiStars);
				}
			}
		} catch {
			// Ignore errors, use last known count
		}

		return stars;
	},
};
