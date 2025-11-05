import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { create } from "zustand";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";

type Resume = RouterOutput["resume"]["getById"];

interface ResumeStoreState {
	resume: Resume | null;
}

interface ResumeStoreActions {
	setResume: (resume: Resume | null) => void;
	updateResume: (updates: Partial<Resume>) => void;
	// Placeholder for future debounced update function
	scheduleUpdate: () => void;
}

type ResumeStore = ResumeStoreState & ResumeStoreActions;

const useResumeStore = create<ResumeStore>((set, get) => {
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	return {
		resume: null,
		setResume: (resume) => set({ resume }),
		updateResume: (updates) => {
			const currentResume = get().resume;
			if (!currentResume) return;
			set({ resume: { ...currentResume, ...updates } });
			get().scheduleUpdate();
		},
		scheduleUpdate: () => {
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				// TODO: Implement tRPC mutation to update resume
				debounceTimer = null;
			}, 500);
		},
	};
});

/**
 * Hook to fetch and manage resume state using Zustand store.
 * Fetches the resume using tRPC and stores it in the Zustand store.
 * The store state is accessible from anywhere within the /builder/$resumeId DOM tree.
 *
 * @returns The resume state, loading state, and store actions for updating the resume
 */
export function useResume() {
	const params = useParams({ from: "/builder/$resumeId" });
	const { resume, setResume, updateResume } = useResumeStore();

	const { data } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	// Sync fetched data to store
	useEffect(() => {
		if (data) setResume(data);
	}, [data, setResume]);

	return { resume, updateResume };
}

/**
 * Hook to access the resume from the store.
 * The resume is guaranteed to be non-null after the route component's initial load check.
 * Use this hook in child components instead of useResumeStore when you need the resume.
 */
export function useResumeData(): Resume {
	const resume = useResumeStore((state) => state.resume);

	if (!resume) {
		throw new Error("Resume not loaded.");
	}

	return resume;
}
