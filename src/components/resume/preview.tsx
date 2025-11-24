import { Trans } from "@lingui/react/macro";
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

type Props = React.ComponentProps<"div"> & {
	pageClassName?: string;
	showPageNumbers?: boolean;
};

function getTemplateComponent(template: z.infer<typeof templateSchema>) {
	return match(template)
		.with("onyx", () => OnyxTemplate)
		.with("ditto", () => DittoTemplate)
		.exhaustive();
}

export const ResumePreview = ({ showPageNumbers, pageClassName, ...props }: Props) => {
	const metadata = useResumeStore((state) => state.resume.data.metadata);
	const style = useCSSVariables(metadata);

	const totalNumberOfPages = metadata.layout.pages.length;

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
			<div style={style} {...props}>
				{metadata.layout.pages.map((pageLayout, pageIndex) => {
					const pageNumber = pageIndex + 1;
					const TemplateComponent = getTemplateComponent(metadata.template);

					return (
						<div key={pageIndex} className="relative">
							{showPageNumbers && totalNumberOfPages > 1 && (
								<div className="-top-6 absolute left-0">
									<span className="font-medium text-foreground text-xs">
										<Trans>
											Page {pageNumber} of {totalNumberOfPages}
										</Trans>
									</span>
								</div>
							)}

							<div
								className={cn(
									`page page-${pageIndex}`,
									pageIndex > 0 && "print:break-before-page",
									styles.page,
									pageClassName,
								)}
							>
								<TemplateComponent pageIndex={pageIndex} pageLayout={pageLayout} />
							</div>
						</div>
					);
				})}
			</div>
		</IconContext.Provider>
	);
};
