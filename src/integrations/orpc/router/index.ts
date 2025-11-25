import { authRouter } from "./auth";
import { githubRouter } from "./github";
import { printerRouter } from "./printer";
import { resumeRouter } from "./resume";
import { storageRouter } from "./storage";

export default {
	auth: authRouter,
	github: githubRouter,
	resume: resumeRouter,
	storage: storageRouter,
	printer: printerRouter,
};
