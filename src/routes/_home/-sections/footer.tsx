import { motion } from "motion/react";
import { useState } from "react";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Copyright } from "@/components/ui/copyright";

export function Footer() {
	return (
		<section id="footer" className="p-4 pb-12 md:p-8 md:pb-16">
			<div className="grid grid-cols-2 gap-4 md:grid-cols-5 2xl:grid-cols-6">
				<div className="col-span-2 space-y-4 2xl:col-span-1 order-3 md:order-1">
					<BrandIcon variant="logo" />

					<div className="space-y-2">
						<h1 className="font-bold text-lg tracking-tight">Reactive Resume</h1>
						<p className="text-muted-foreground leading-relaxed">
							A free and open-source resume builder that simplifies the process of creating, updating, and sharing your
							resume.
						</p>
					</div>

					<Copyright className="mt-8 hidden md:block" />
				</div>

				<div className="space-y-4 md:col-start-4 2xl:col-start-5 order-1 md:order-2">
					<h2 className="text-muted-foreground tracking-tight">Links</h2>

					<ul className="space-y-4">
						<FooterLink url="https://docs.rxresu.me" label="Documentation" />
						<FooterLink url="https://github.com/AmruthPillai/Reactive-Resume" label="Source Code" />
						<FooterLink url="https://crowdin.com/project/reactive-resume" label="Translations" />
						<FooterLink url="https://opencollective.com/reactive-resume" label="Donate" />
					</ul>
				</div>

				<div className="space-y-4 order-2 md:order-3">
					<h2 className="text-muted-foreground tracking-tight">Links</h2>

					<ul className="space-y-4">
						<FooterLink url="https://docs.rxresu.me" label="Documentation" />
						<FooterLink url="https://github.com/AmruthPillai/Reactive-Resume" label="Source Code" />
						<FooterLink url="https://crowdin.com/project/reactive-resume" label="Translations" />
						<FooterLink url="https://opencollective.com/reactive-resume" label="Donate" />
					</ul>
				</div>

				<div className="col-span-2 order-4 md:hidden">
					<Copyright className="mt-8" />
				</div>
			</div>
		</section>
	);
}

function FooterLink({ url, label }: { url: string; label: string }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<li className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="relative font-medium"
				style={{ display: "inline-block" }}
			>
				{label}

				<motion.div
					initial={{ width: 0, opacity: 0 }}
					animate={isHovered ? { width: "100%", opacity: 1 } : { width: 0, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="-bottom-0.5 pointer-events-none absolute left-0 h-px rounded bg-primary"
				/>
			</a>
		</li>
	);
}
