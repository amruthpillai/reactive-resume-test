import { t } from "@lingui/core/macro";
import {
	ArticleIcon,
	BooksIcon,
	BriefcaseIcon,
	CertificateIcon,
	CodeSimpleIcon,
	CompassToolIcon,
	FootballIcon,
	GraduationCapIcon,
	HandHeartIcon,
	type IconProps,
	MessengerLogoIcon,
	PhoneIcon,
	TranslateIcon,
	TrophyIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { match } from "ts-pattern";
import type { SectionType } from "@/schema/resume/data";
import { cn } from "../style";

export const getSectionTitle = (type: "basics" | "summary" | SectionType): string => {
	return match(type)
		.with("basics", () => t`Basics`)
		.with("summary", () => t`Summary`)
		.with("profiles", () => t`Profiles`)
		.with("experience", () => t`Experience`)
		.with("education", () => t`Education`)
		.with("skills", () => t`Skills`)

		.with("awards", () => t`Awards`)
		.with("certifications", () => t`Certifications`)
		.with("interests", () => t`Interests`)
		.with("languages", () => t`Languages`)
		.with("projects", () => t`Projects`)
		.with("publications", () => t`Publications`)
		.with("references", () => t`References`)
		.with("volunteer", () => t`Volunteer`)
		.exhaustive();
};

export const getSectionIcon = (type: "basics" | "summary" | SectionType, props?: IconProps): React.ReactNode => {
	const iconProps = { ...props, className: cn("shrink-0", props?.className) };

	return match(type)
		.with("basics", () => <UserIcon {...iconProps} />)
		.with("summary", () => <ArticleIcon {...iconProps} />)
		.with("profiles", () => <MessengerLogoIcon {...iconProps} />)
		.with("experience", () => <BriefcaseIcon {...iconProps} />)
		.with("education", () => <GraduationCapIcon {...iconProps} />)
		.with("skills", () => <CompassToolIcon {...iconProps} />)

		.with("awards", () => <TrophyIcon {...iconProps} />)
		.with("certifications", () => <CertificateIcon {...iconProps} />)
		.with("interests", () => <FootballIcon {...iconProps} />)
		.with("languages", () => <TranslateIcon {...iconProps} />)
		.with("projects", () => <CodeSimpleIcon {...iconProps} />)
		.with("publications", () => <BooksIcon {...iconProps} />)
		.with("references", () => <PhoneIcon {...iconProps} />)
		.with("volunteer", () => <HandHeartIcon {...iconProps} />)
		.exhaustive();
};
