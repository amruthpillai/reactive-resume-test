import { type HTMLMotionProps, motion, type TargetAndTransition, type VariantLabels } from "motion/react";
import { Switch as SwitchPrimitives } from "radix-ui";
import * as React from "react";
import { useControlledState } from "@/hooks/use-controlled-state";
import { getStrictContext } from "@/hooks/use-safe-context";

type SwitchContextType = {
	isChecked: boolean;
	setIsChecked: (isChecked: boolean) => void;
	isPressed: boolean;
	setIsPressed: (isPressed: boolean) => void;
};

const [SwitchProvider, useSwitch] = getStrictContext<SwitchContextType>("SwitchContext");

type SwitchProps = Omit<React.ComponentProps<typeof SwitchPrimitives.Root>, "asChild"> & HTMLMotionProps<"button">;

function Switch({ onCheckedChange, ...props }: SwitchProps) {
	const [isPressed, setIsPressed] = React.useState(false);
	const [isChecked, setIsChecked] = useControlledState({
		value: props.checked,
		defaultValue: props.defaultChecked,
		onChange: onCheckedChange,
	});

	return (
		<SwitchProvider value={{ isChecked, setIsChecked, isPressed, setIsPressed }}>
			<SwitchPrimitives.Root {...props} onCheckedChange={setIsChecked} asChild>
				<motion.button
					whileTap="tap"
					initial={false}
					data-slot="switch"
					onTapStart={() => setIsPressed(true)}
					onTapCancel={() => setIsPressed(false)}
					onTap={() => setIsPressed(false)}
					{...props}
				/>
			</SwitchPrimitives.Root>
		</SwitchProvider>
	);
}

type SwitchThumbProps = Omit<React.ComponentProps<typeof SwitchPrimitives.Thumb>, "asChild"> &
	HTMLMotionProps<"div"> & {
		pressedAnimation?: TargetAndTransition | VariantLabels | boolean;
	};

function SwitchThumb({
	pressedAnimation,
	transition = { type: "spring", stiffness: 300, damping: 25 },
	...props
}: SwitchThumbProps) {
	const { isPressed } = useSwitch();

	return (
		<SwitchPrimitives.Thumb asChild>
			<motion.div
				data-slot="switch-thumb"
				whileTap="tab"
				layout
				transition={transition}
				animate={isPressed ? pressedAnimation : undefined}
				{...props}
			/>
		</SwitchPrimitives.Thumb>
	);
}

type SwitchIconPosition = "left" | "right" | "thumb";

type SwitchIconProps = HTMLMotionProps<"div"> & {
	position: SwitchIconPosition;
};

function SwitchIcon({ position, transition = { type: "spring", bounce: 0 }, ...props }: SwitchIconProps) {
	const { isChecked } = useSwitch();

	const isAnimated = React.useMemo(() => {
		if (position === "right") return !isChecked;
		if (position === "left") return isChecked;
		if (position === "thumb") return true;
		return false;
	}, [position, isChecked]);

	return (
		<motion.div
			data-slot={`switch-${position}-icon`}
			animate={isAnimated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
			transition={transition}
			{...props}
		/>
	);
}

export {
	Switch,
	SwitchThumb,
	SwitchIcon,
	useSwitch,
	type SwitchProps,
	type SwitchThumbProps,
	type SwitchIconProps,
	type SwitchIconPosition,
	type SwitchContextType,
};
