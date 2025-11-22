import { IconContext, type IconProps } from "@phosphor-icons/react";
import { useMemo } from "react";
import { match } from "ts-pattern";
import type z from "zod";
import type { ResumeData, templateSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { ResumePreviewProvider } from "./hooks/use-resume-preview";
import styles from "./preview.module.css";
import { DittoTemplate } from "./templates/ditto";
import { OnyxTemplate } from "./templates/onyx";

type Props = {
	data: ResumeData;
	className?: string;
	pageClassName?: string;
};

function getTemplateComponent(template: z.infer<typeof templateSchema>) {
	return match(template)
		.with("onyx", () => OnyxTemplate)
		.with("ditto", () => DittoTemplate)
		.exhaustive();
}

export const ResumePreview = ({ data, className, pageClassName }: Props) => {
	const iconProps = useMemo<IconProps>(() => {
		return {
			weight: "regular",
			color: "var(--page-primary-color)",
			size: data.metadata.typography.body.fontSize * 1.5,
		};
	}, [data.metadata.typography.body.fontSize]);

	return (
		<IconContext.Provider value={iconProps}>
			<ResumePreviewProvider data={data}>
				<div className={cn("flex flex-col gap-8", className)}>
					{data.metadata.layout.pages.map((pageLayout, pageIndex) => {
						const TemplateComponent = getTemplateComponent(data.metadata.template);

						return (
							<div key={pageIndex} className={cn("page", `page-${pageIndex}`, styles.page_preview, pageClassName)}>
								<TemplateComponent pageIndex={pageIndex} pageLayout={pageLayout} />
							</div>
						);
					})}
				</div>
			</ResumePreviewProvider>
		</IconContext.Provider>
	);
};
