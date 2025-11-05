import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useWindowSize } from "usehooks-ts";
import z from "zod";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils/style";
import { BuilderHeader } from "./-components/header";
import { BuilderSidebarLeft } from "./-components/sidebar/left";
import { BuilderSidebarRight } from "./-components/sidebar/right";
import { useBuilderStore } from "./-store/builder";
import { useResume } from "./-store/resume";

export const Route = createFileRoute("/builder/$resumeId")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) throw redirect({ to: "/auth/login", replace: true });
		return { session: context.session };
	},
	loader: async () => {
		const layout = await getBuilderLayoutServerFn();
		return { layout };
	},
});

function RouteComponent() {
	const { resume } = useResume();
	const isMobile = useIsMobile();
	const { width } = useWindowSize();
	const [isDragging, setDragging] = useState(false);
	const { layout: initialLayout } = Route.useLoaderData();

	const leftSidebarRef = useRef<ImperativePanelHandle>(null);
	const rightSidebarRef = useRef<ImperativePanelHandle>(null);
	const { setLeftSidebarRef, setRightSidebarRef } = useBuilderStore();

	const maxSidebarSize = useMemo(() => Math.round((600 / width) * 100), [width]);
	const collapsedSidebarSize = useMemo(() => (isMobile ? 0 : (48 / width) * 100), [width, isMobile]);

	useEffect(() => {
		setLeftSidebarRef(leftSidebarRef);
		setRightSidebarRef(rightSidebarRef);
	}, [setLeftSidebarRef, setRightSidebarRef]);

	const onLayout = useCallback((layout: number[]) => {
		setBuilderLayoutServerFn({ data: layout });
	}, []);

	if (!resume) return <LoadingScreen />;

	return (
		<div className="flex flex-col">
			<BuilderHeader />

			<ResizablePanelGroup direction="horizontal" className="relative mt-14 w-svw" onLayout={onLayout}>
				<ResizablePanel
					ref={leftSidebarRef}
					collapsible
					minSize={15}
					defaultSize={isMobile ? 0 : initialLayout[0]}
					maxSize={maxSidebarSize}
					collapsedSize={collapsedSidebarSize}
					className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
				>
					<BuilderSidebarLeft />
				</ResizablePanel>
				<ResizableHandle withHandle onDragging={setDragging} />
				<ResizablePanel
					defaultSize={initialLayout[1]}
					className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
				>
					<Outlet />
				</ResizablePanel>
				<ResizableHandle withHandle onDragging={setDragging} />
				<ResizablePanel
					ref={rightSidebarRef}
					collapsible
					minSize={15}
					defaultSize={isMobile ? 0 : initialLayout[2]}
					maxSize={maxSidebarSize}
					collapsedSize={collapsedSidebarSize}
					className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
				>
					<BuilderSidebarRight />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

const defaultLayout = [30, 40, 30];
const BUILDER_LAYOUT_COOKIE_NAME = "builder_layout";

export const setBuilderLayoutServerFn = createServerFn({ method: "POST" })
	.inputValidator(z.array(z.number()))
	.handler(async ({ data }) => {
		setCookie(BUILDER_LAYOUT_COOKIE_NAME, JSON.stringify(data));
	});

export const getBuilderLayoutServerFn = createServerFn({ method: "GET" }).handler(async () => {
	const layout = getCookie(BUILDER_LAYOUT_COOKIE_NAME);
	if (!layout) return defaultLayout;
	return z.array(z.number()).parse(JSON.parse(layout));
});
