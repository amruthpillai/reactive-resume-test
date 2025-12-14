import { Trans } from "@lingui/react/macro";
import {
	CloudArrowUpIcon,
	CurrencyDollarIcon,
	DatabaseIcon,
	FilesIcon,
	GithubLogoIcon,
	GlobeIcon,
	type Icon,
	KeyIcon,
	LayoutIcon,
	LockSimpleIcon,
	PaletteIcon,
	ProhibitIcon,
	ShieldCheckIcon,
	TranslateIcon,
} from "@phosphor-icons/react";

type Feature = {
	id: string;
	icon: Icon;
	title: string;
	description: string;
};

const features: Feature[] = [
	{
		id: "free",
		icon: CurrencyDollarIcon,
		title: "Free",
		description: "Completely free, forever, no hidden costs.",
	},
	{
		id: "open-source",
		icon: GithubLogoIcon,
		title: "Open Source",
		description: "By the community, for the community.",
	},
	{
		id: "no-ads",
		icon: ProhibitIcon,
		title: "No Advertising, No Tracking",
		description: "For a secure and distraction-free experience.",
	},
	{
		id: "data-security",
		icon: DatabaseIcon,
		title: "Data Security",
		description: "Your data is secure, and never shared or sold to anyone.",
	},
	{
		id: "self-host",
		icon: CloudArrowUpIcon,
		title: "Self-Host",
		description: "You have the choice to deploy on your own infrastructure, or use the public version.",
	},
	{
		id: "languages",
		icon: TranslateIcon,
		title: "Multilingual",
		description: "Available in multiple languages. If you would like to contribute, check out Crowdin.",
	},
	{
		id: "auth",
		icon: KeyIcon,
		title: "Easy Sign-In",
		description: "Sign in with GitHub, Google, Passkey, and more.",
	},
	{
		id: "2fa",
		icon: ShieldCheckIcon,
		title: "Two-Factor Authentication",
		description: "Enhanced security for your account.",
	},
	{
		id: "unlimited-resumes",
		icon: FilesIcon,
		title: "Unlimited Resumes",
		description: "Create as many resumes as you want, without limits.",
	},
	{
		id: "design",
		icon: PaletteIcon,
		title: "Design Flexibility",
		description: "Personalize your resume with any colors, fonts or designs, and make it your own.",
	},
	{
		id: "templates",
		icon: LayoutIcon,
		title: "12+ Templates",
		description: "Beautiful templates to choose from, with more on the way.",
	},
	{
		id: "public",
		icon: GlobeIcon,
		title: "Shareable Links",
		description: "Share your resume with a public URL, and let others view it.",
	},
	{
		id: "password-protection",
		icon: LockSimpleIcon,
		title: "Password Protection",
		description: "Protect your resume with a password, and let only people with the password view it.",
	},
];

type FeatureCardProps = {
	feature: Feature;
};

function FeatureCard({ feature }: FeatureCardProps) {
	return (
		<div className="relative flex h-full min-h-[160px] flex-col justify-between overflow-hidden border-r border-b p-6">
			<div className="relative z-10 flex flex-col gap-4">
				{/* Icon */}
				<div className="flex items-start justify-between">
					<feature.icon size={32} weight="thin" />
				</div>

				{/* Content */}
				<div className="flex flex-col gap-1">
					<h3 className="font-semibold text-base leading-none tracking-tight">{feature.title}</h3>
					<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
				</div>
			</div>
		</div>
	);
}

export function Features() {
	return (
		<section id="features">
			{/* Header */}
			<div className="space-y-2 p-4 md:p-8">
				<h2 className="font-semibold text-2xl tracking-tight md:text-4xl">
					<Trans>Features</Trans>
				</h2>

				<p className="text-muted-foreground leading-relaxed">
					<Trans>
						Everything you need to create, customize, and share professional resumes. Built with privacy in mind,
						powered by open source, and completely free forever.
					</Trans>
				</p>
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{features.map((feature) => (
					<FeatureCard key={feature.id} feature={feature} />
				))}
			</div>
		</section>
	);
}
