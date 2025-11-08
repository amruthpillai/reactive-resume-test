import { RichInput } from "@/components/input/rich-input";
import { useResumeData } from "@/routes/builder/$resumeId/-hooks/resume";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import { SectionBase } from "../shared/section-base";

export function SummarySectionBuilder() {
	const section = useResumeData((state) => state.sections.summary);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onChange = (value: string) => {
		updateResume((draft) => {
			draft.sections.summary.content = value;
		});
	};

	return (
		<SectionBase type="summary">
			<RichInput value={section.content} onChange={onChange} />
		</SectionBase>
	);
}
