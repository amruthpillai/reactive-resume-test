import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, CheckIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/auth/verify-2fa")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
	},
});

const twoFactorSchema = z.object({
	code: z.string().length(6, "Code must be 6 digits"),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

function RouteComponent() {
	const router = useRouter();
	const navigate = useNavigate();

	const twoFactorForm = useForm<TwoFactorFormValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			code: "",
		},
	});

	const onTwoFactorSubmit = async (data: TwoFactorFormValues) => {
		const toastId = toast.loading(t`Verifying code...`);

		const result = await authClient.twoFactor.verifyTotp({
			code: data.code,
		});

		if (result.error) {
			toast.error(result.error.message, { id: toastId });
			return;
		}

		router.invalidate();
		toast.dismiss(toastId);
		navigate({ to: "/dashboard", replace: true });
	};

	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>Two-Factor Authentication</Trans>
				</h1>
				<div className="text-muted-foreground">
					<Trans>Enter the verification code from your authenticator app</Trans>
				</div>
			</div>

			<Form {...twoFactorForm}>
				<form className="grid gap-6" onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}>
					<FormField
						control={twoFactorForm.control}
						name="code"
						render={({ field }) => (
							<FormItem className="justify-self-center">
								<FormControl>
									<InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
										<InputOTPGroup>
											<InputOTPSlot index={0} className="size-12 text-lg" />
											<InputOTPSlot index={1} className="size-12 text-lg" />
											<InputOTPSlot index={2} className="size-12 text-lg" />
										</InputOTPGroup>
										<InputOTPSeparator />
										<InputOTPGroup>
											<InputOTPSlot index={3} className="size-12 text-lg" />
											<InputOTPSlot index={4} className="size-12 text-lg" />
											<InputOTPSlot index={5} className="size-12 text-lg" />
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex gap-x-2">
						<Button type="button" variant="outline" className="flex-1" asChild>
							<Link to="/auth/login">
								<ArrowLeftIcon />
								<Trans>Back to Login</Trans>
							</Link>
						</Button>

						<Button type="submit" className="flex-1">
							<CheckIcon />
							<Trans>Verify</Trans>
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}
