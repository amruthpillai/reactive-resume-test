import { BarricadeIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SectionBase } from "../shared/section-base";

export function LayoutSectionBuilder() {
	return (
		<SectionBase type="layout">
			<Alert>
				<BarricadeIcon />
				<AlertTitle>Under Construction</AlertTitle>
				<AlertDescription>This section is not yet available. Please check back later.</AlertDescription>
			</Alert>
		</SectionBase>
	);
}
