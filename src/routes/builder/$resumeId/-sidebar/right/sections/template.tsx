import { BarricadeIcon } from "@phosphor-icons/react";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
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
	const template = useResumeData((state) => state.metadata.template);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onSelectTemplate = (template: z.infer<typeof templateSchema>) => {
		updateResume((draft) => {
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
