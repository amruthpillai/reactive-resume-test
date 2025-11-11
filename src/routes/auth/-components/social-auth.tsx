import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FingerprintIcon, GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";

export function SocialAuth() {
	const router = useRouter();
	const { data: authProviders } = useSuspenseQuery(orpc.auth.listProviders.queryOptions());

	const socialProviders = authProviders.filter((provider) => provider !== "credential");

	const handlePasskeyLogin = async () => {
		const toastId = toast.loading(t`Signing in...`);

		await authClient.signIn.passkey({
			fetchOptions: {
				onSuccess: () => {
					toast.dismiss(toastId);
					router.invalidate();
				},
				onError: ({ error }) => {
					toast.error(error.message, { id: toastId });
				},
			},
		});
	};

	const handleSocialLogin = async (provider: (typeof socialProviders)[number]) => {
		const toastId = toast.loading(t`Signing in...`);

		await authClient.signIn.social({
			provider,
			callbackURL: "/dashboard",
			fetchOptions: {
				onSuccess: () => {
					toast.dismiss(toastId);
					router.invalidate();
				},
				onError: ({ error }) => {
					toast.error(error.message, { id: toastId });
				},
			},
		});
	};

	return (
		<>
			<div className="flex items-center gap-x-2">
				<hr className="flex-1" />
				<span className="font-medium text-xs tracking-wide">
					<Trans context="Choose to authenticate with a social provider (Google, GitHub, etc.) instead of email and password">
						or continue with
					</Trans>
				</span>
				<hr className="flex-1" />
			</div>

			<div>
				<div className="grid grid-cols-2 gap-4">
					<Button variant="secondary" onClick={handlePasskeyLogin} className="col-span-full">
						<FingerprintIcon />
						Passkey
					</Button>

					<Button
						onClick={() => handleSocialLogin("google")}
						className={cn(
							"hidden flex-1 bg-[#4285F4] text-white hover:bg-[#4285F4]/80",
							socialProviders.includes("google") && "inline-flex",
						)}
					>
						<GoogleLogoIcon />
						Google
					</Button>

					<Button
						onClick={() => handleSocialLogin("github")}
						className={cn(
							"hidden flex-1 bg-[#2b3137] text-white hover:bg-[#2b3137]/80",
							socialProviders.includes("github") && "inline-flex",
						)}
					>
						<GithubLogoIcon />
						GitHub
					</Button>
				</div>
			</div>
		</>
	);
}
