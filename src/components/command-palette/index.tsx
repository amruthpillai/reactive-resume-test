import { Trans } from "@lingui/react/macro";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Command, CommandEmpty, CommandInput, CommandList } from "../ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { type CommandKPage, commandKPages } from "./pages";
import { useCommandPaletteStore } from "./store";

export function CommandPalette() {
	const location = useLocation();
	const inputRef = useRef<HTMLInputElement>(null);
	const { open, search, pages, setOpen, setSearch, goBack, reset } = useCommandPaletteStore();

	const isFirstPage = pages.length === 0;
	const currentPage = pages[pages.length - 1];

	const disabled = useMemo(() => {
		const routeWhitelist = ["/dashboard", "/builder"];
		return !routeWhitelist.some((route) => location.pathname.startsWith(route));
	}, [location.pathname]);

	// Toggle command palette with Cmd+K / Ctrl+K
	useHotkeys(
		["meta+k", "ctrl+k"],
		(e) => {
			if (disabled) return;
			e.preventDefault();
			setOpen(!open);
		},
		{
			preventDefault: true,
			enableOnFormTags: true,
		},
		[open, disabled],
	);

	// Handle backspace: delete text if input has text, go back if empty, close if first page
	useHotkeys(
		"backspace",
		(e) => {
			// Only handle if the command palette is open
			if (!open) return;

			const input = inputRef.current;
			if (!input) return;

			// Only handle if input is focused
			if (document.activeElement !== input) return;

			// If input has text, let the default behavior handle it (delete character)
			if (search.length > 0) return;

			// If input is empty, prevent default and go back
			e.preventDefault();
			goBack();
		},
		{
			preventDefault: false, // We'll prevent it conditionally
			enableOnFormTags: true,
		},
		[open, search],
	);

	// Close with Escape
	useHotkeys(
		"escape",
		() => {
			if (!open) return;
			setOpen(false);
		},
		{
			preventDefault: true,
			enableOnFormTags: true,
		},
		[open],
	);

	// Reset state when dialog closes
	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
	};

	const renderPage = () => {
		const pageKey = (currentPage as CommandKPage) || "home";
		const PageComponent = commandKPages[pageKey] || commandKPages.home;
		return <PageComponent />;
	};

	return (
		<Dialog open={open && !disabled} onOpenChange={handleOpenChange}>
			<DialogHeader className="sr-only">
				<DialogTitle>
					<Trans>Builder Command Palette</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Type a command or search...</Trans>
				</DialogDescription>
			</DialogHeader>

			<DialogContent
				className="overflow-hidden p-0"
				aria-label={isFirstPage ? "Command Palette" : `Command Palette - ${currentPage}`}
			>
				<Command
					loop
					aria-label="Command Palette"
					className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3"
				>
					<CommandInput
						ref={inputRef}
						value={search}
						onValueChange={handleSearchChange}
						placeholder={isFirstPage ? "Type a command or search..." : "Search..."}
						aria-label="Search commands"
					/>

					<CommandList>
						<CommandEmpty>
							<Trans>No results found.</Trans>
						</CommandEmpty>

						{renderPage()}
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
