import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/style";

type ComboboxOption<TValue extends string | number = string> = {
	value: TValue;
	label: React.ReactNode;
	keywords?: string[];
};

function useControllableState<T>(params: { value?: T; defaultValue: T; onChange?: (next: T) => void }) {
	const { value, defaultValue, onChange } = params;
	const isControlled = value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = React.useState<T>(defaultValue);

	React.useEffect(() => {
		if (!isControlled) setUncontrolledValue(defaultValue);
	}, [defaultValue, isControlled]);

	const currentValue = isControlled ? (value as T) : uncontrolledValue;

	const setValue = React.useCallback(
		(next: T) => {
			if (!isControlled) setUncontrolledValue(next);
			onChange?.(next);
		},
		[isControlled, onChange],
	);

	return [currentValue, setValue] as const;
}

type ComboboxProps<TValue extends string | number = string> = Omit<
	React.ComponentProps<typeof PopoverContent>,
	"defaultValue" | "children"
> & {
	options: ReadonlyArray<ComboboxOption<TValue>>;
	value?: TValue | null;
	defaultValue?: TValue | null;
	className?: string;
	buttonProps?: Omit<React.ComponentProps<typeof Button>, "children"> & {
		children?: (value: TValue | null, option: ComboboxOption<TValue> | null) => React.ReactNode;
	};
	onValueChange?: (value: TValue | null, option: ComboboxOption<TValue> | null) => void;
};

function Combobox<TValue extends string | number = string>({
	options,
	value,
	defaultValue = null,
	buttonProps,
	onValueChange,
	...props
}: ComboboxProps<TValue>) {
	const [open, setOpen] = React.useState(false);

	const [selectedValue, setSelectedValue] = useControllableState<TValue | null>({
		value,
		defaultValue,
		onChange: (next) => onValueChange?.(next, options.find((o) => o.value === next) ?? null),
	});

	const selectedOption = React.useMemo(() => {
		return options.find((option) => option.value === selectedValue) ?? null;
	}, [options, selectedValue]);

	const selectedLabel = selectedOption?.label;

	const onSelect = React.useCallback(
		(current: string) => {
			const next = (current as unknown as TValue) ?? null;
			const toggled = selectedValue === next ? null : next;
			setSelectedValue(toggled);
			setOpen(false);
		},
		[selectedValue, setSelectedValue],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role="combobox"
					variant="outline"
					className={cn("justify-between active:scale-100", buttonProps?.className)}
					aria-expanded={open}
					{...buttonProps}
				>
					{typeof buttonProps?.children === "function" ? (
						buttonProps.children(selectedValue, selectedOption)
					) : (
						<>
							{selectedLabel ?? "Select..."}
							<CaretUpDownIcon className="ml-2 shrink-0 opacity-50" />
						</>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent align="start" className={cn("w-[200px] p-0", props.className)} {...props}>
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValue === option.value;

								return (
									<CommandItem
										key={String(option.value)}
										value={String(option.value)}
										keywords={option.keywords}
										onSelect={onSelect}
									>
										<span>{option.label}</span>
										<CheckIcon className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export type { ComboboxOption, ComboboxProps };
export { Combobox };
