import { Trans } from "@lingui/react/macro";
import { DotsSixVerticalIcon, ListPlusIcon, XIcon } from "@phosphor-icons/react";
import { Reorder, useDragControls } from "motion/react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { IconPicker } from "@/components/input/icon-picker";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { basicsSchema } from "@/schema/resume";
import { generateId } from "@/utils/string";

type CustomField = z.infer<typeof basicsSchema>["customFields"][number];

type Props = {
	onSubmit: (data: z.infer<typeof basicsSchema>) => void;
};

export function CustomFieldsSection({ onSubmit }: Props) {
	const form = useFormContext<z.infer<typeof basicsSchema>>();

	const customFields = useWatch({ control: form.control, name: "customFields" });

	const customFieldsArray = useFieldArray({
		control: form.control,
		keyName: "key",
		name: "customFields",
		shouldUnregister: false,
	});

	function handleReorder(newFields: CustomField[]) {
		const currentFieldsMap = Object.fromEntries(customFields.map((f) => [f.id, f]));
		const reordered = newFields.map((field) => currentFieldsMap[field.id] ?? field);
		form.setValue("customFields", reordered);
		form.handleSubmit(onSubmit)();
	}

	function handleRemove(index: number) {
		customFieldsArray.remove(index);
		form.handleSubmit(onSubmit)();
	}

	function handleAdd() {
		customFieldsArray.append({ id: generateId(), icon: "acorn", text: "" });
		form.handleSubmit(onSubmit)();
	}

	return (
		<Reorder.Group className="space-y-4" values={customFieldsArray.fields} onReorder={handleReorder}>
			{customFieldsArray.fields.map((field, index) => (
				<CustomFieldItem key={field.id} field={field}>
					<FormField
						control={form.control}
						name={`customFields.${index}.icon`}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<IconPicker
										{...field}
										className="rounded-r-none!"
										onChange={(icon) => {
											field.onChange(icon);
											form.handleSubmit(onSubmit)();
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`customFields.${index}.text`}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Input
										{...field}
										className="rounded-l-none! border-l-0! focus-visible:border-input focus-visible:ring-0"
										onChange={(e) => {
											field.onChange(e.target.value);
											form.handleSubmit(onSubmit)();
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button size="icon" variant="ghost" className="ml-2" onClick={() => handleRemove(index)}>
						<XIcon />
					</Button>
				</CustomFieldItem>
			))}

			<Button variant="ghost" onClick={handleAdd}>
				<ListPlusIcon />
				<Trans>Add a custom field</Trans>
			</Button>
		</Reorder.Group>
	);
}

type CustomFieldItemProps = {
	field: CustomField;
	children: React.ReactNode;
};

function CustomFieldItem({ field, children }: CustomFieldItemProps) {
	const controls = useDragControls();

	return (
		<Reorder.Item
			key={field.id}
			value={field}
			dragListener={false}
			dragControls={controls}
			className="flex items-center"
		>
			<Button size="icon" variant="ghost" className="mr-2" onPointerDown={(e) => controls.start(e)}>
				<DotsSixVerticalIcon />
			</Button>

			{children}
		</Reorder.Item>
	);
}
