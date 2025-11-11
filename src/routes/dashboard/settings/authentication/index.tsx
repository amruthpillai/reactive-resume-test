import { Trans } from "@lingui/react/macro";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { useAuthAccounts, useAuthProviderActions, useEnabledProviders } from "./-components/hooks";
import { PasskeysSection } from "./-components/passkeys";
import { PasswordSection } from "./-components/password";
import { SocialProviderSection } from "./-components/social-provider";
import { TwoFactorSection } from "./-components/two-factor";

export const Route = createFileRoute("/dashboard/settings/authentication/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isProviderEnabled } = useEnabledProviders();
	const { hasAccount, getAccountByProviderId } = useAuthAccounts();
	const { handleLinkSocial, handleUnlinkSocial } = useAuthProviderActions();

	const hasPassword = hasAccount("credential");
	const isGoogleEnabled = isProviderEnabled("google");
	const isGitHubEnabled = isProviderEnabled("github");

	const googleAccount = useMemo(() => getAccountByProviderId("google"), [getAccountByProviderId]);
	const githubAccount = useMemo(() => getAccountByProviderId("github"), [getAccountByProviderId]);

	const hasGoogle = !!googleAccount;
	const hasGitHub = !!githubAccount;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-2">
				<ShieldCheckIcon weight="light" className="size-6" />
				<h1 className="font-medium text-2xl tracking-tight">
					<Trans>Authentication</Trans>
				</h1>
			</div>

			<Separator />

			<div className="max-w-xl space-y-4">
				<PasswordSection hasPassword={hasPassword} />

				<TwoFactorSection hasPassword={hasPassword} />

				<PasskeysSection />

				{isGoogleEnabled && (
					<SocialProviderSection
						provider="google"
						isConnected={hasGoogle}
						accountId={googleAccount?.accountId}
						onLink={handleLinkSocial}
						onUnlink={handleUnlinkSocial}
						animationDelay={0.2}
					/>
				)}

				{isGitHubEnabled && (
					<SocialProviderSection
						provider="github"
						isConnected={hasGitHub}
						accountId={githubAccount?.accountId}
						onLink={handleLinkSocial}
						onUnlink={handleUnlinkSocial}
						animationDelay={0.3}
					/>
				)}
			</div>
		</div>
	);
}
