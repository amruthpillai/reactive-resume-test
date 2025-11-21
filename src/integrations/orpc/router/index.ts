import { authRouter } from "./auth";
import { printerRouter } from "./printer";
import { resumeRouter } from "./resume";
import { storageRouter } from "./storage";

export default {
	auth: authRouter,
	resume: resumeRouter,
	storage: storageRouter,
	printer: printerRouter,
};
