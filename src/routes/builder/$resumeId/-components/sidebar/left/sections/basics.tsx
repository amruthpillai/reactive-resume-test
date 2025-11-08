import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { URLInput } from "@/components/input/url-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResumeData } from "@/routes/builder/$resumeId/-hooks/resume";
import { basicsSchema } from "@/schema/resume";
import { CustomFieldsSection } from "./custom-fields";

export function BasicsSectionBuilder() {
	const basics = useResumeData((state) => state.basics);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm({
		resolver: zodResolver(basicsSchema),
		defaultValues: basics,
		mode: "onChange",
	});

	const onSubmit = (data: z.infer<typeof basicsSchema>) => {
		updateResume((draft) => {
			draft.basics = data;
		});
	};

	return (
		<div id="basics" className="space-y-4">
			<h2 className="font-bold text-2xl tracking-tight">
				<Trans>Basics</Trans>
			</h2>

			<Form {...form}>
				<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="headline"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Headline</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="website"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<URLInput {...field} value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<CustomFieldsSection onSubmit={onSubmit} />
				</form>
			</Form>
		</div>
	);
}
