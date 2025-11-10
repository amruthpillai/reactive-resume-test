import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CaretDownIcon, MagicWandIcon, PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { ChipInput } from "@/components/input/chip-input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { resumeSchema } from "@/integrations/drizzle/schema";
import { orpc } from "@/integrations/orpc/client";
import { generateId, generateRandomName, slugify } from "@/utils/string";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = resumeSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateResumeDialog({ open, onOpenChange }: DialogProps<"resume.create">) {
	const { closeDialog } = useDialogStore();
	const { queryClient } = useRouteContext({ from: "/dashboard" });

	const { mutate: createResume, isPending } = useMutation(orpc.resume.create.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			name: "",
			slug: "",
			tags: [],
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const onSubmit = (data: FormValues) => {
		const toastId = toast.loading(t`Creating your resume...`);

		createResume(data, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: orpc.resume.list.key() });
				toast.success(t`Your resume has been created successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new resume</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Start building your resume by giving it a name.</Trans>
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
						<ResumeForm />

						<DialogFooter>
							<ButtonGroup aria-label="Create Resume with Options" className="gap-x-px">
								<Button type="submit" disabled={isPending}>
									Create
								</Button>
								<Button size="icon" disabled={isPending}>
									<CaretDownIcon />
								</Button>
							</ButtonGroup>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateResumeDialog({ open, onOpenChange, data }: DialogProps<"resume.update">) {
	const { closeDialog } = useDialogStore();
	const { queryClient } = useRouteContext({ from: "/dashboard" });

	const { mutate: updateResume, isPending } = useMutation(orpc.resume.update.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			name: data.name,
			slug: data.slug,
			tags: data.tags,
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		if (!name) return;
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const onSubmit = (data: FormValues) => {
		const toastId = toast.loading(t`Updating your resume...`);

		updateResume(data, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: orpc.resume.list.key() });
				toast.success(t`Your resume has been updated successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update Resume</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Changed your mind? Rename your resume to something more descriptive.</Trans>
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
						<ResumeForm />

						<DialogFooter>
							<Button type="submit" disabled={isPending}>
								<Trans>Save Changes</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ResumeForm() {
	const form = useFormContext<FormValues>();
	const { session } = useRouteContext({ from: "/dashboard" });

	const slugPrefix = useMemo(() => {
		return `${window.location.origin}/${session.user.username}/`;
	}, [session.user.username]);

	const onGenerateName = () => {
		form.setValue("name", generateRandomName(), { shouldDirty: true });
	};

	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Name</Trans>
						</FormLabel>
						<div className="flex items-center gap-x-2">
							<FormControl>
								<Input min={1} max={64} {...field} />
							</FormControl>

							<Button size="icon" variant="outline" title={t`Generate a random name`} onClick={onGenerateName}>
								<MagicWandIcon />
							</Button>
						</div>
						<FormMessage />
						<FormDescription>
							<Trans>Tip: You can name the resume referring to the position you are applying for.</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="slug"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Slug</Trans>
						</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput min={1} max={64} className="pl-0!" {...field} />
								<InputGroupAddon align="inline-start">
									<InputGroupText>{slugPrefix}</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
						<FormMessage />
						<FormDescription>
							<Trans>This is a URL-friendly name for your resume.</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="tags"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Tags</Trans>
						</FormLabel>
						<FormControl>
							<ChipInput
								{...field}
								onChange={(values) => {
									const formattedValues = new Set(values.map((value) => slugify(value)));
									field.onChange(Array.from(formattedValues));
								}}
							/>
						</FormControl>
						<FormMessage />
						<FormDescription>
							<Trans>Tags can be used to categorize your resume by keywords.</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>
		</>
	);
}
