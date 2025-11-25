import { publicProcedure } from "../context";
import { githubService } from "../services/github";

export const githubRouter = {
	getStarCount: publicProcedure.handler(async (): Promise<number> => {
		return githubService.getStarCount();
	}),
};
