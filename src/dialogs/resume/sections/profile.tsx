import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { AtIcon, PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useForm, useFormContext } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { URLInput } from "@/components/input/url-input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import type { DialogProps } from "@/dialogs/store";
import { profileItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = profileItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProfileDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.profiles.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			network: data?.network ?? "",
			username: data?.username ?? "",
			website: data?.website ?? { url: "", label: "" },
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.sections.profiles.items.push(data);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new profile</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProfileForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Create</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateProfileDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.profiles.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			network: data.network,
			username: data.username,
			website: data.website,
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.profiles.items.findIndex((item) => item.id === data.id);
			if (index === -1) return;
			draft.sections.profiles.items[index] = data;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing profile</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProfileForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Create</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ProfileForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<FormField
				control={form.control}
				name="network"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Network</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="username"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Username</Trans>
						</FormLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<AtIcon />
								</InputGroupText>
							</InputGroupAddon>

							<FormControl>
								<InputGroupInput {...field} />
							</FormControl>
						</InputGroup>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="website"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>Website</FormLabel>
						<FormControl>
							<URLInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
