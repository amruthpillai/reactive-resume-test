import { Trans } from "@lingui/react/macro";
import { LinkBreakIcon, LinkIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AuthProvider } from "@/integrations/auth/types";
import { getProviderIcon, getProviderName } from "./hooks";

type SocialProviderSectionProps = {
	provider: AuthProvider;
	isConnected: boolean;
	accountId?: string;
	onConnect: (provider: AuthProvider) => void;
	onDisconnect: (provider: AuthProvider, accountId: string) => void;
	animationDelay?: number;
};

export function SocialProviderSection({
	provider,
	isConnected,
	accountId,
	onConnect,
	onDisconnect,
	animationDelay = 0,
}: SocialProviderSectionProps) {
	const providerName = useMemo(() => getProviderName(provider), [provider]);
	const providerIcon = useMemo(() => getProviderIcon(provider), [provider]);

	const handleConnect = useCallback(() => {
		onConnect(provider);
	}, [onConnect, provider]);

	const handleDisconnect = useCallback(() => {
		if (accountId) {
			onDisconnect(provider, accountId);
		}
	}, [accountId, onDisconnect, provider]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: animationDelay }}
		>
			<Separator />

			<div className="mt-4 flex items-center justify-between gap-x-4">
				<h2 className="flex items-center gap-x-3 font-medium text-base">
					{providerIcon}
					{providerName}
				</h2>

				{match(isConnected)
					.with(true, () => (
						<Button variant="outline" onClick={handleDisconnect}>
							<LinkBreakIcon />
							<Trans>Disconnect</Trans>
						</Button>
					))
					.with(false, () => (
						<Button variant="outline" onClick={handleConnect}>
							<LinkIcon />
							<Trans>Connect</Trans>
						</Button>
					))
					.exhaustive()}
			</div>
		</motion.div>
	);
}
