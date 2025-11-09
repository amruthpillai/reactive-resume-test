import { XIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type Props = Omit<React.ComponentProps<"div">, "value" | "onChange"> & {
	value: string[];
	onChange: (value: string[]) => void;
};

export function ChipInput({ value, onChange, className, ...props }: Props) {
	const [input, setInput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const addChip = React.useCallback(
		(chip: string) => {
			const trimmed = chip.trim();
			if (trimmed && !value.includes(trimmed)) {
				onChange([...value, trimmed]);
			}
		},
		[value, onChange],
	);

	const removeChip = React.useCallback(
		(index: number) => {
			if (index < 0 || index >= value.length) return;
			onChange(value.filter((_, i) => i !== index));
		},
		[value, onChange],
	);

	const handleInputChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			if (newValue.includes(",")) {
				const parts = newValue.split(",");
				parts.slice(0, -1).forEach(addChip);
				setInput(parts[parts.length - 1]);
			} else {
				setInput(newValue);
			}
		},
		[addChip],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
				e.preventDefault();
				addChip(input);
				setInput("");
			} else if (e.key === "Backspace" && input === "" && value.length > 0) {
				removeChip(value.length - 1);
			}
		},
		[input, value.length, addChip, removeChip],
	);

	const handleWrapperClick = React.useCallback(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<div
			tabIndex={-1}
			onClick={handleWrapperClick}
			className={cn(
				"flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 focus-within:border-ring",
				className,
			)}
			{...props}
		>
			{value.map((chip, idx) => (
				<Badge key={chip + idx} variant="outline" className="flex items-center gap-1 pr-1 pl-2">
					<span>{chip}</span>
					<button
						type="button"
						tabIndex={-1}
						aria-label={`Remove ${chip}`}
						onClick={(e) => {
							e.stopPropagation();
							removeChip(idx);
						}}
						className="ml-0.5 hover:text-destructive focus:outline-none"
					>
						<XIcon className="size-3" />
					</button>
				</Badge>
			))}

			<input
				type="text"
				value={input}
				ref={inputRef}
				autoComplete="off"
				aria-label="Add chip"
				onKeyDown={handleKeyDown}
				onChange={handleInputChange}
				className="min-w-0 grow border-none bg-transparent outline-none focus:outline-none focus:ring-0"
			/>
		</div>
	);
}
