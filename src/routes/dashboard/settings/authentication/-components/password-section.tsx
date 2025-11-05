import { Trans } from "@lingui/react/macro";
import { PasswordIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";

type PasswordSectionProps = {
	hasPassword: boolean;
};

export function PasswordSection({ hasPassword }: PasswordSectionProps) {
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();

	const handlePasswordAction = useCallback(() => {
		if (hasPassword) {
			openDialog("auth.change-password", undefined);
		} else {
			navigate({ to: "/auth/forgot-password" });
		}
	}, [hasPassword, navigate, openDialog]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex items-center justify-between gap-x-4"
		>
			<h2 className="flex items-center gap-x-3 font-medium text-base">
				<PasswordIcon />
				<Trans>Password</Trans>
			</h2>

			{match(hasPassword)
				.with(true, () => (
					<Button variant="outline" onClick={handlePasswordAction}>
						<Trans>Change Password</Trans>
					</Button>
				))
				.with(false, () => (
					<Button variant="outline" asChild>
						<Link to="/auth/forgot-password">
							<Trans>Set Password</Trans>
						</Link>
					</Button>
				))
				.exhaustive()}
		</motion.div>
	);
}
