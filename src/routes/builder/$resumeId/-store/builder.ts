import type { ImperativePanelHandle } from "react-resizable-panels";
import { create } from "zustand";

interface BuilderStoreState {
	leftSidebarRef: React.RefObject<ImperativePanelHandle | null>;
	rightSidebarRef: React.RefObject<ImperativePanelHandle | null>;
}

interface BuilderStoreActions {
	setLeftSidebarRef: (ref: React.RefObject<ImperativePanelHandle | null>) => void;
	setRightSidebarRef: (ref: React.RefObject<ImperativePanelHandle | null>) => void;
}

type BuilderStore = BuilderStoreState & BuilderStoreActions;

export const useBuilderStore = create<BuilderStore>((set) => ({
	leftSidebarRef: { current: null },
	rightSidebarRef: { current: null },
	setLeftSidebarRef: (ref) => set({ leftSidebarRef: ref }),
	setRightSidebarRef: (ref) => set({ rightSidebarRef: ref }),
}));

/**
 * Hook to access sidebar refs from the builder store.
 * Returns the left and right sidebar refs for controlling the resizable panels.
 */
export function useBuilderSidebar() {
	const leftSidebar = useBuilderStore((state) => state.leftSidebarRef);
	const rightSidebar = useBuilderStore((state) => state.rightSidebarRef);

	return { leftSidebar, rightSidebar };
}
