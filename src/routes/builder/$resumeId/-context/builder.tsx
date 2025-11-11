import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useWindowSize } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-mobile";

export interface BuilderContextValue {
	leftSidebar: React.RefObject<ImperativePanelHandle | null>;
	rightSidebar: React.RefObject<ImperativePanelHandle | null>;
	toggleLeftSidebar: () => void;
	toggleRightSidebar: () => void;
	isDragging: boolean;
	setDragging: Dispatch<SetStateAction<boolean>>;
	maxSidebarSize: number;
	defaultSidebarSize: number;
	collapsedSidebarSize: number;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export interface BuilderProviderProps {
	children: ReactNode;
}

export function BuilderProvider({ children }: BuilderProviderProps) {
	const isMobile = useIsMobile();
	const { width } = useWindowSize();
	const [isDragging, setDragging] = useState(false);

	const leftSidebarRef = useRef<ImperativePanelHandle>(null);
	const rightSidebarRef = useRef<ImperativePanelHandle>(null);

	const maxSidebarSize = useMemo(() => {
		if (!width) return 100;
		return Math.round((600 / width) * 100);
	}, [width]);

	const collapsedSidebarSize = useMemo(() => {
		if (!width) return 0;
		return isMobile ? 0 : (48 / width) * 100;
	}, [width, isMobile]);

	const defaultSidebarSize = useMemo(() => (isMobile ? 95 : 30), [isMobile]);

	const toggleLeftSidebar = useCallback(() => {
		const sidebar = leftSidebarRef.current;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(defaultSidebarSize) : sidebar.collapse();
	}, [defaultSidebarSize]);

	const toggleRightSidebar = useCallback(() => {
		const sidebar = rightSidebarRef.current;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(defaultSidebarSize) : sidebar.collapse();
	}, [defaultSidebarSize]);

	const value = useMemo<BuilderContextValue>(
		() => ({
			leftSidebar: leftSidebarRef,
			rightSidebar: rightSidebarRef,
			toggleLeftSidebar,
			toggleRightSidebar,
			isDragging,
			setDragging,
			defaultSidebarSize,
			maxSidebarSize,
			collapsedSidebarSize,
		}),
		[toggleLeftSidebar, toggleRightSidebar, isDragging, defaultSidebarSize, maxSidebarSize, collapsedSidebarSize],
	);

	return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilderContext() {
	const context = useContext(BuilderContext);

	if (!context) {
		throw new Error("useBuilderContext must be used within a BuilderProvider");
	}

	return context;
}

export function useBuilderSidebar() {
	const { leftSidebar, rightSidebar, toggleLeftSidebar, toggleRightSidebar } = useBuilderContext();

	return { leftSidebar, rightSidebar, toggleLeftSidebar, toggleRightSidebar };
}
