import { BarricadeIcon } from "@phosphor-icons/react";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { templateSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";

export function TemplateSectionBuilder() {
	return (
		<SectionBase type="template">
			<Alert>
				<BarricadeIcon />
				<AlertTitle>Under Construction</AlertTitle>
				<AlertDescription>This section is not yet available. Please check back later.</AlertDescription>
			</Alert>

			<TemplateSectionForm />
		</SectionBase>
	);
}

function TemplateSectionForm() {
	const template = useResumeStore((state) => state.resume.data.metadata.template);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onSelectTemplate = (template: z.infer<typeof templateSchema>) => {
		updateResumeData((draft) => {
			draft.metadata.template = template;
		});
	};

	return (
		<div className="mt-4 space-y-4">
			<p>Selected Template: {template}</p>

			<div className="flex flex-wrap gap-4">
				{templateSchema.options.map((template) => (
					<Button key={template} variant="secondary" onClick={() => onSelectTemplate(template)}>
						{template}
					</Button>
				))}
			</div>
		</div>
	);
}
