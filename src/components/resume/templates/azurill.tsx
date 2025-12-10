import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	"space-y-1 [&>.section-content>ul]:space-y-1 [&>h6]:text-(--page-primary-color)",
	"group-data-[type=sidebar]:text-center group-data-[type=sidebar]:[&_.section-item-header>div]:flex-col group-data-[type=sidebar]:[&_.section-item-header>div]:gap-y-0.5 group-data-[type=sidebar]:[&_.section-item-header_p]:text-center",
	"group-data-[type=main]:[&>.section-content]:ml-3 group-data-[type=main]:[&>.section-content]:border-(--page-primary-color) group-data-[type=main]:[&>.section-content]:border-l group-data-[type=main]:[&>.section-content]:pl-4",
	"group-data-[type=main]:[&>.section-content]:relative group-data-[type=main]:[&>.section-content]:after:absolute group-data-[type=main]:[&>.section-content]:after:top-4 group-data-[type=main]:[&>.section-content]:after:left-0 group-data-[type=main]:[&>.section-content]:after:size-2.5 group-data-[type=main]:[&>.section-content]:after:translate-x-[-50%] group-data-[type=main]:[&>.section-content]:after:translate-y-[-50%] group-data-[type=main]:[&>.section-content]:after:rounded-full group-data-[type=main]:[&>.section-content]:after:border group-data-[type=main]:[&>.section-content]:after:border-(--page-primary-color) group-data-[type=main]:[&>.section-content]:after:bg-(--page-background-color) group-data-[type=main]:[&>.section-content]:after:content-['']",
);

/**
 * Template: Azurill
 */
export function AzurillTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-azurill page-content">
			{isFirstPage && <Header />}

			<div className="flex pb-(--page-margin-y)">
				{!fullWidth && (
					<aside
						data-type="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-4 overflow-x-hidden pl-(--page-margin-x)"
					>
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}

				<main data-type="main" className="group page-main grow space-y-4 px-(--page-margin-x)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header flex flex-col items-center justify-center space-y-1.5 px-(--page-margin-x) py-(--page-margin-y)">
			<PagePicture />

			<div className="text-center">
				<h2 className="page-name">{basics.name}</h2>
				<p className="page-headline">{basics.headline}</p>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
	);
}
