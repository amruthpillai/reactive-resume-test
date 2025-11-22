import { LevelDisplay } from "@/components/level/display";
import { useResumeStore } from "../store/resume";

type Props = {
	level: number;
	className?: string;
};

export function PageLevel({ level, className }: Props) {
	const { icon, type } = useResumeStore((state) => state.resume.data.metadata.design.level);

	return <LevelDisplay icon={icon} type={type} level={level} className={className} />;
}
