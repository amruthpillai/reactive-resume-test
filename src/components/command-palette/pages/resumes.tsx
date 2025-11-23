import { Trans } from "@lingui/react/macro";
import { PlusIcon, ReadCvLogoIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CommandLoading } from "cmdk";
import { CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/integrations/orpc/client";
import { useCommandPaletteStore } from "../store";

export function ResumesCommandPage() {
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();
	const reset = useCommandPaletteStore((state) => state.reset);

	const { data: resumes, isLoading } = useQuery(orpc.resume.list.queryOptions());

	const onCreate = () => {
		navigate({ to: "/dashboard/resumes" });
		openDialog("resume.create", undefined);
		reset();
	};

	const onNavigate = (path: string) => {
		navigate({ to: path });
		reset();
	};

	return (
		<CommandGroup>
			<CommandItem onSelect={onCreate}>
				<PlusIcon />
				<Trans>Create a new resume</Trans>
			</CommandItem>

			{isLoading ? (
				<CommandLoading>
					<Trans>Loading resumes...</Trans>
				</CommandLoading>
			) : (
				resumes?.map((resume) => (
					<CommandItem
						key={resume.id}
						value={resume.id}
						keywords={[resume.name]}
						onSelect={() => onNavigate(`/builder/${resume.id}`)}
					>
						<ReadCvLogoIcon />
						{resume.name}

						<CommandShortcut className="opacity-0 transition-opacity group-data-[selected=true]/command-item:opacity-100">
							Press <Kbd>Enter</Kbd> to open
						</CommandShortcut>
					</CommandItem>
				))
			)}
		</CommandGroup>
	);
}
