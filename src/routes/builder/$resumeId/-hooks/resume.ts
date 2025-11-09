import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";
import { type Resume, useResumeStore } from "../-store/resume";

/**
 * Hook to fetch and manage resume state using Zustand store.
 * Fetches the resume using oRPC and stores it in the Zustand store.
 * The store state is accessible from anywhere within the /builder/$resumeId DOM tree.
 *
 * @returns The resume state, loading state, and store actions for updating the resume
 */
export function useResume() {
	const dataRef = useRef<Resume | null>(null);
	const params = useParams({ from: "/builder/$resumeId" });
	const setResume = useResumeStore((state) => state.setResume);

	const { data } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	// Set the store when data is available
	// useLayoutEffect runs synchronously after all DOM mutations but before paint,
	// ensuring the store is populated before the browser paints
	useLayoutEffect(() => {
		if (dataRef.current !== data) {
			dataRef.current = data;
			setResume(data);
		}
	}, [data, setResume]);

	return data;
}

/**
 * Hook to access the resume from the store.
 * The resume is guaranteed to be non-null after the route component's initial load check.
 * Use this hook in child components instead of useResumeStore when you need the resume.
 *
 * @param selector - Optional selector function to select a specific slice of the resume state.
 *                   When provided, the component will only re-render when the selected slice changes.
 * @returns The selected slice of the resume, or the full resume if no selector is provided.
 *
 * @example
 * // Get the full resume
 * const resume = useResumeData();
 *
 * @example
 * // Get only the basics section (prevents re-renders when other sections change)
 * const basics = useResumeData((resume) => resume.basics);
 *
 * @example
 * // Get a nested property
 * const name = useResumeData((resume) => resume.basics.name);
 */
export function useResumeData(): ResumeData;
export function useResumeData<T>(selector: (resume: ResumeData) => T): T;
export function useResumeData<T>(selector?: (resume: ResumeData) => T): ResumeData | T {
	const selected = useResumeStore((state) => {
		if (!state.resume) return null;
		return selector ? selector(state.resume.data) : state.resume.data;
	});

	if (selected === null) throw new Error("Resume not loaded.");

	return selected;
}
