import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";

export function PagePicture({ className, style }: { className?: string; style?: React.CSSProperties }) {
	const name = useResumePreview((data) => data.basics.name);
	const picture = useResumePreview((data) => data.picture);

	if (picture.url === "") return null;

	return (
		<div
			className={cn("page-picture shrink-0 overflow-hidden", picture.hidden && "hidden", className)}
			style={{
				maxWidth: `${picture.size}pt`,
				maxHeight: `${picture.size}pt`,
				aspectRatio: picture.aspectRatio,
				borderRadius: `${picture.borderRadius}%`,
				border: picture.borderWidth > 0 ? `${picture.borderWidth}pt solid ${picture.borderColor}` : "none",
				boxShadow: picture.shadowWidth > 0 ? `0 0 ${picture.shadowWidth}pt 0 ${picture.shadowColor}` : "none",
				...style,
			}}
		>
			<img
				alt={name}
				src={picture.url}
				className="size-full object-cover"
				style={{ transform: `rotate(${picture.rotation}deg)` }}
			/>
		</div>
	);
}
