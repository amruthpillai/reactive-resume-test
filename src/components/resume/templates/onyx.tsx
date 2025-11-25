import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { match } from "ts-pattern";
import { TiptapContent } from "@/components/input/rich-input";
import type { SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageCustomSection } from "../shared/page-custom";
import { PageIcon } from "../shared/page-icon";
import { PageLevel } from "../shared/page-level";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { PageSection } from "../shared/page-section";
import { PageSummary } from "../shared/page-summary";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn("space-y-1 [&>.section-content>ul]:space-y-1 [&>h6]:text-(--page-primary-color)");

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
 * Template: Onyx
 */
export function OnyxTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-onyx page-content px-(--page-margin-x) py-(--page-margin-y)">
			{isFirstPage && <Header />}

			<div className="space-y-4">
				<main className="page-main space-y-4">
					{main.map((section) => {
						const Component = getSectionComponent(section);
						return <Component key={section} id={section} />;
					})}
				</main>

				{!fullWidth && (
					<aside className="page-sidebar space-y-4">
						{sidebar.map((section) => {
							const Component = getSectionComponent(section);
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header mb-2 flex items-center gap-x-4 border-(--page-primary-color) border-b pb-(--page-margin-y)">
			<PagePicture />

			{/* Basics */}
			<div className="page-basics flex flex-col gap-y-1.5">
				<div>
					<h2 className="page-name font-bold leading-snug!">{basics.name}</h2>
					<p className="page-headline leading-snug!">{basics.headline}</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
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

function SummarySection() {
	return <PageSummary className={cn("space-y-1", "[&>h6]:text-(--page-primary-color)")} />;
}

function ProfilesSection() {
	return (
		<PageSection type="profiles" className={cn("space-y-1", "[&>h6]:text-(--page-primary-color)")}>
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

function ExperienceSection() {
	return (
		<PageSection type="experience" className={sectionClassName}>
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

function EducationSection() {
	return (
		<PageSection type="education" className={sectionClassName}>
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

function ProjectsSection() {
	return (
		<PageSection type="projects" className={sectionClassName}>
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

function SkillsSection() {
	return (
		<PageSection type="skills" className={sectionClassName}>
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

function LanguagesSection() {
	return (
		<PageSection type="languages" className={sectionClassName}>
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

function InterestsSection() {
	return (
		<PageSection type="interests" className={sectionClassName}>
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

function AwardsSection() {
	return (
		<PageSection type="awards" className={sectionClassName}>
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

function CertificationsSection() {
	return (
		<PageSection type="certifications" className={sectionClassName}>
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

function PublicationsSection() {
	return (
		<PageSection type="publications" className={sectionClassName}>
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

function VolunteerSection() {
	return (
		<PageSection type="volunteer" className={sectionClassName}>
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

function ReferencesSection() {
	return (
		<PageSection type="references" className={sectionClassName}>
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

function CustomSection({ id }: { id: string }) {
	return <PageCustomSection sectionId={id} className={sectionClassName} />;
}
