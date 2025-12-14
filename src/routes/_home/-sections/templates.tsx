import { Trans } from "@lingui/react/macro";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { TemplateMetadata } from "@/dialogs/resume/template/data";
import { templates } from "@/dialogs/resume/template/data";

type TemplateItemProps = {
	metadata: TemplateMetadata;
};

function TemplateItem({ metadata }: TemplateItemProps) {
	return (
		<motion.div
			className="group relative shrink-0"
			whileHover={{ scale: 1.05, zIndex: 20 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div className="relative aspect-page w-56 overflow-hidden rounded-lg border bg-card shadow-lg transition-shadow duration-300 group-hover:shadow-2xl md:w-64 lg:w-72">
				<img src={metadata.imageUrl} alt={metadata.name} className="size-full object-cover" />

				{/* Subtle overlay on hover */}
				<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Template name on hover */}
				<div className="absolute right-0 bottom-0 left-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
					<p className="font-semibold text-white drop-shadow-lg">{metadata.name}</p>
				</div>
			</div>
		</motion.div>
	);
}

type MarqueeRowProps = {
	templates: Array<[string, TemplateMetadata]>;
	rowId: string;
	direction: "left" | "right";
	duration?: number;
};

function MarqueeRow({ templates, rowId, direction, duration = 35 }: MarqueeRowProps) {
	const animateX = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

	return (
		<motion.div
			className="flex gap-x-6 will-change-transform"
			animate={{ x: animateX }}
			transition={{
				x: {
					repeat: Infinity,
					repeatType: "loop",
					duration,
					ease: "linear",
				},
			}}
		>
			{templates.map(([template, metadata], index) => (
				<TemplateItem key={`${rowId}-${template}-${index}`} metadata={metadata} />
			))}
		</motion.div>
	);
}

export function Templates() {
	const email = "hello@amruthpillai.com";

	// Split templates into two rows and duplicate for seamless infinite scroll
	const { row1, row2 } = useMemo(() => {
		const entries = Object.entries(templates);
		const half = Math.ceil(entries.length / 2);
		const firstHalf = entries.slice(0, half);
		const secondHalf = entries.slice(half);

		// Duplicate each row for seamless scrolling
		return {
			row1: [...firstHalf, ...firstHalf],
			row2: [...secondHalf, ...secondHalf],
		};
	}, []);

	return (
		<section id="templates" className="border-t-0! p-4 md:p-8">
			<div className="space-y-4">
				<h2 className="font-semibold text-2xl tracking-tight md:text-4xl xl:text-5xl">
					<Trans>Templates</Trans>
				</h2>

				<p className="text-muted-foreground leading-relaxed">
					<Trans>
						Explore our diverse selection of templates, each designed to fit different styles, professions, and
						personalities. Reactive Resume currently offers 12 templates, with more on the way. If you have ideas or
						requests for new templates, please share them with me at{" "}
						<a className="font-medium underline underline-offset-2" href={`mailto:${email}`}>
							{email}
						</a>
						.
					</Trans>
				</p>
			</div>

			<div className="relative mt-4 overflow-hidden py-4">
				{/* Gradient fade overlays for seamless edges */}
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />

				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

				{/* Marquee container with minimum height */}
				<div className="flex min-h-[300px] flex-col gap-y-6 md:min-h-[350px] lg:min-h-[400px]">
					{/* First row - moves left to right */}
					<MarqueeRow templates={row1} rowId="row1" direction="left" />

					{/* Second row - moves right to left (opposite direction) */}
					<MarqueeRow templates={row2} rowId="row2" direction="right" />
				</div>
			</div>
		</section>
	);
}
