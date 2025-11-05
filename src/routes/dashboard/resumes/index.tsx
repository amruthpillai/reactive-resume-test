import { Trans } from "@lingui/react/macro";
import { ReadCvLogoIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/integrations/orpc/client";
import { CreateResumeCard } from "./-components/create-card";
import { ResumeCard } from "./-components/resume-card";

export const Route = createFileRoute("/dashboard/resumes/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: resumes } = useSuspenseQuery(orpc.resume.list.queryOptions());

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-2">
				<ReadCvLogoIcon weight="light" className="size-6" />
				<h1 className="font-medium text-2xl tracking-tight">
					<Trans>Resumes</Trans>
				</h1>
			</div>

			<Separator />

			<div className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				<motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
					<CreateResumeCard />
				</motion.div>

				<AnimatePresence>
					{resumes?.map((resume, index) => (
						<motion.div
							layout
							key={resume.id}
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, y: -50, filter: "blur(12px)" }}
							transition={{ delay: (index + 1) * 0.1 }}
						>
							<ResumeCard resume={resume} index={index} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
