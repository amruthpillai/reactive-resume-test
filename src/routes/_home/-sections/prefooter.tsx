import { Trans } from "@lingui/react/macro";
import { TextMaskEffect } from "@/components/animation/text-mask";

export function Prefooter() {
	return (
		<section id="prefooter" className="space-y-8 py-20">
			<TextMaskEffect text="Reactive Resume" />

			<div className="mx-auto max-w-4xl space-y-8 px-8 text-center xl:px-0">
				<h2 className="font-bold text-2xl tracking-tight md:text-4xl">
					<Trans>By the community, for the community.</Trans>
				</h2>

				<div className="space-y-4 text-muted-foreground leading-loose">
					<Trans>
						<p>
							Reactive Resume thrives thanks to its vibrant community. This project owes its progress to numerous
							individuals who've dedicated their time and skills to make it better. We celebrate the coders who've
							enhanced its features on GitHub, the linguists whose translations on Crowdin have made it accessible to a
							broader audience, and the people who've donated to support its continued development.
						</p>
					</Trans>
				</div>
			</div>
		</section>
	);
}
