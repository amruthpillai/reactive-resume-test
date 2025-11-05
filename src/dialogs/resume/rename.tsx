import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { MagicWandIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
import slugify from "@sindresorhus/slugify";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
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
import { orpc } from "@/integrations/orpc/client";
import { generateRandomName } from "@/utils/string";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1).max(64),
	slug: z
		.string()
		.trim()
		.min(1)
		.max(64)
		.transform((value) => slugify(value)),
});

type FormValues = z.infer<typeof formSchema>;

export function RenameResumeDialog({ open, onOpenChange, data }: DialogProps<"resume.rename">) {
	const { closeDialog } = useDialogStore();
	const { queryClient, session } = useRouteContext({ from: "/dashboard" });

	const { mutate: renameResume, isPending } = useMutation(orpc.resume.rename.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			name: data.name,
			slug: data.slug,
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const slugPrefix = useMemo(() => {
		return `${window.location.origin}/${session.user.username}/`;
	}, [session.user.username]);

	const onSubmit = (data: FormValues) => {
		const toastId = toast.loading(t`Renaming your resume...`);

		renameResume(data, {
			onSuccess: async () => {
				await queryClient.invalidateQueries(orpc.resume.list.queryOptions());
				toast.success(t`Your resume has been renamed successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
	};

	const onGenerateName = () => {
		form.setValue("name", generateRandomName(), { shouldDirty: true });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Rename Resume</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Changed your mind? Rename your resume to something more descriptive.</Trans>
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
