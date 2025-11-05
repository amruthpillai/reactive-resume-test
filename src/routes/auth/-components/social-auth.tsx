import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";

export function SocialAuth() {
	const { data: authProviders } = useSuspenseQuery(orpc.auth.listProviders.queryOptions());

	const socialProviders = authProviders.filter((provider) => provider !== "credential");

	const handleSocialLogin = async (provider: (typeof socialProviders)[number]) => {
		const toastId = toast.loading(t`Signing in...`);

		authClient.signIn.social({
			provider,
			callbackURL: "/dashboard",
			fetchOptions: {
				onSuccess: () => {
					toast.dismiss(toastId);
				},
				onError: ({ error }) => {
					toast.error(error.message, { id: toastId });
				},
			},
		});
	};

	if (socialProviders.length === 0) return null;

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
				<div className="flex gap-x-4">
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
