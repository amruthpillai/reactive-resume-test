import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { match } from "ts-pattern";
import { TiptapContent } from "@/components/input/rich-input";
import type { SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";
import { PageIcon } from "../shared/page-icon";
import { PageLevel } from "../shared/page-level";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { PageSection } from "../shared/page-section";
import { PageSummary } from "../shared/page-summary";
import type { TemplateProps } from "./types";

function getSectionComponent(section: "summary" | SectionType | (string & {})) {
	return match(section)
		.with("summary", () => SummarySection)
		.with("profiles", () => ProfilesSection)
		.with("experience", () => ExperienceSection)
		.with("education", () => EducationSection)
		.with("projects", () => ProjectsSection)
		.with("skills", () => SkillsSection)
		.with("languages", () => LanguagesSection)
		.with("interests", () => InterestsSection)
		.with("awards", () => AwardsSection)
		.with("certifications", () => CertificationsSection)
		.with("publications", () => PublicationsSection)
		.with("volunteer", () => VolunteerSection)
		.with("references", () => ReferencesSection)
		.otherwise(() => CustomSection);
}

/**
 * Template: Ditto
 */
export function DittoTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar } = pageLayout;

	return (
		<div className="template-ditto page-content space-y-4">
			{isFirstPage && <Header />}

			<div className="flex">
				<aside className="page-sidebar w-(--page-sidebar-width) shrink-0 space-y-4 pl-(--page-margin-x)">
					{sidebar.map((section) => {
						const Component = getSectionComponent(section);
						return <Component key={section} id={section} />;
					})}
				</aside>

				<main className="page-main grow space-y-4 px-(--page-margin-x)">
					{main.map((section) => {
						const Component = getSectionComponent(section);
						return <Component key={section} id={section} />;
					})}
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumePreview((data) => data.basics);

	return (
		<div className="page-header relative">
			<div className="bg-(--page-primary-color) text-(--page-background-color)">
				<div className="flex items-center px-(--page-margin-x)">
					<div className="flex w-(--page-sidebar-width) shrink-0 justify-center">
						<PagePicture className="absolute top-8" />
					</div>

					<div className="grow py-(--page-margin-y)">
						<h2 className="page-name">{basics.name}</h2>
						<p className="page-headline">{basics.headline}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center px-(--page-margin-x)">
				<div className="w-(--page-sidebar-width) shrink-0" />

				<div className="flex grow flex-wrap items-center gap-x-3 gap-y-1 pt-3">
					{basics.email && (
						<div className="flex items-center gap-x-1.5">
							<EnvelopeIcon />
							<PageLink url={`mailto:${basics.email}`} label={basics.email} />
						</div>
					)}

					{basics.phone && (
						<div className="flex items-center gap-x-1.5">
							<PhoneIcon />
							<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
						</div>
					)}

					{basics.location && (
						<div className="flex items-center gap-x-1.5">
							<MapPinIcon />
							<span>{basics.location}</span>
						</div>
					)}

					{basics.website.url && (
						<div className="flex items-center gap-x-1.5">
							<GlobeIcon />
							<PageLink {...basics.website} />
						</div>
					)}

					{basics.customFields.map((field) => (
						<div key={field.id} className="flex items-center gap-x-1.5">
							<PageIcon icon={field.icon} />
							<span>{field.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function SummarySection() {
	return <PageSummary className="space-y-1 [&>h6]:text-(--page-primary-color)" />;
}

export function ProfilesSection() {
	return (
		<PageSection type="profiles" className="space-y-1 [&>h6]:text-(--page-primary-color)">
			{(item) => (
				<div key={item.id} className="flex gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div className="w-full">
						<p>
							<strong>{item.network}</strong>
						</p>
						<PageLink {...item.website} label={item.website.label || item.username} className="block" />
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function ExperienceSection() {
	return (
		<PageSection type="experience" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.company}</strong>
							</p>
							<p className="text-right">{item.location}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.position}</p>
							<p className="text-right">{item.period}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function EducationSection() {
	return (
		<PageSection type="education" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div className="mb-2">
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.school}</strong>
							</p>
							<p className="text-right">{[item.degree, item.grade].filter(Boolean).join(" • ")}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.area}</p>
							<p className="text-right">{[item.location, item.period].filter(Boolean).join(" • ")}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function ProjectsSection() {
	return (
		<PageSection type="projects" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div className="flex items-center justify-between">
						<p>
							<strong>{item.name}</strong>
						</p>
						<p className="text-right">{item.period}</p>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function SkillsSection() {
	return (
		<PageSection type="skills" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="flex gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div className="w-full">
						<p>
							<strong>{item.name}</strong>
						</p>
						<p className="opacity-60">{item.proficiency}</p>
						<small>{item.keywords.join(", ")}</small>
						<PageLevel level={item.level} className="mt-1.5" />
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function LanguagesSection() {
	return (
		<PageSection type="languages" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="w-full">
					<p>
						<strong>{item.language}</strong>
					</p>
					<p className="opacity-60">{item.fluency}</p>
					<PageLevel level={item.level} className="mt-1.5" />
				</div>
			)}
		</PageSection>
	);
}

export function InterestsSection() {
	return (
		<PageSection type="interests" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="flex w-full gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div>
						<p>
							<strong>{item.name}</strong>
						</p>
						<p className="opacity-60">{item.keywords.join(", ")}</p>
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function AwardsSection() {
	return (
		<PageSection type="awards" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p className="text-right">{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.awarder}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function CertificationsSection() {
	return (
		<PageSection type="certifications" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p className="text-right">{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.issuer}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function PublicationsSection() {
	return (
		<PageSection type="publications" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p className="text-right">{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.publisher}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function VolunteerSection() {
	return (
		<PageSection type="volunteer" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.organization}</strong>
							</p>
							<p className="text-right">{item.period}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.location}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function ReferencesSection() {
	return (
		<PageSection type="references" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<p>
						<strong>{item.name}</strong>
					</p>
					<TiptapContent content={item.description} />
				</div>
			)}
		</PageSection>
	);
}

export function CustomSection({ id }: { id: string }) {
	const section = useResumePreview((data) => data.customSections.find((section) => section.id === id));

	// biome-ignore lint/complexity/noUselessFragments: render empty fragment, instead of null
	if (!section) return <></>;

	return (
		<section
			className={cn(
				`page-section page-custom-section page-section-${id}`,
				section.hidden && "hidden",
				section.content === "" && "hidden",
				"space-y-1 [&>h6]:text-(--page-primary-color)",
			)}
		>
			<h6>{section.title}</h6>
			<TiptapContent content={section.content} />
		</section>
	);
}
