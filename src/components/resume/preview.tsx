import { IconContext, type IconProps } from "@phosphor-icons/react";
import { useMemo } from "react";
import { match } from "ts-pattern";
import type z from "zod";
import type { templateSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useCSSVariables } from "./hooks/use-css-variables";
import { useWebfontLoader } from "./hooks/use-webfont";
import styles from "./preview.module.css";
import { useResumeStore } from "./store/resume";
import { DittoTemplate } from "./templates/ditto";
import { OnyxTemplate } from "./templates/onyx";

type Props = {
	className?: string;
	pageClassName?: string;
};

function getTemplateComponent(template: z.infer<typeof templateSchema>) {
	return match(template)
		.with("onyx", () => OnyxTemplate)
		.with("ditto", () => DittoTemplate)
		.exhaustive();
}

export const ResumePreview = ({ className, pageClassName }: Props) => {
	const metadata = useResumeStore((state) => state.resume.data.metadata);
	const style = useCSSVariables(metadata);
	useWebfontLoader(metadata.typography);

	const iconProps = useMemo<IconProps>(() => {
		return {
			weight: "regular",
			color: "var(--page-primary-color)",
			size: metadata.typography.body.fontSize * 1.5,
		};
	}, [metadata.typography.body.fontSize]);

	return (
		<IconContext.Provider value={iconProps}>
			<div className={cn("relative", className)}>
				<div style={{ all: "initial", ...style }}>
					{metadata.layout.pages.map((pageLayout, pageIndex) => {
						const TemplateComponent = getTemplateComponent(metadata.template);

						return (
							<div
								key={pageIndex}
								className={cn(`page page-${pageIndex}`, "print:break-before-page", styles.page_preview, pageClassName)}
							>
								<TemplateComponent pageIndex={pageIndex} pageLayout={pageLayout} />
							</div>
						);
					})}
				</div>
			</div>
		</IconContext.Provider>
	);
};
