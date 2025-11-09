import * as React from "react";

type UseControllableStateProps<TValue> = {
	value?: TValue;
	defaultValue: TValue;
	onChange?: (next: TValue) => void;
};

export function useControllableState<TValue>({ value, defaultValue, onChange }: UseControllableStateProps<TValue>) {
	const isControlled = value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = React.useState<TValue>(defaultValue);

	React.useEffect(() => {
		if (!isControlled) {
			setUncontrolledValue(defaultValue);
		}
	}, [defaultValue, isControlled]);

	const currentValue = isControlled ? (value as TValue) : uncontrolledValue;

	const setValue = React.useCallback(
		(next: TValue) => {
			if (!isControlled) {
				setUncontrolledValue(next);
			}

			onChange?.(next);
		},
		[isControlled, onChange],
	);

	return [currentValue, setValue] as const;
}
