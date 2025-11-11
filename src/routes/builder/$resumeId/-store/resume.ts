import { debounce } from "es-toolkit";
import { produce } from "immer";
import { create } from "zustand";
import type { RouterOutput } from "@/integrations/orpc/client";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";

export type Resume = RouterOutput["resume"]["getById"];

interface ResumeStoreState {
	resume: Resume | null;
}

interface ResumeStoreActions {
	setResume: (resume: Resume | null) => void;
	updateResume: (fn: (draft: ResumeData) => void) => void;
}

type ResumeStore = ResumeStoreState & ResumeStoreActions;

const syncResume = async (id: string, data: ResumeData) => {
	try {
		await orpc.resume.updateData.call({ id, data });
	} catch (err) {
		console.error("Failed to update resume in backend:", err);
	}
};

const debouncedSyncResume = debounce(syncResume, 500);

export const useResumeStore = create<ResumeStore>((set) => ({
	resume: null,
	setResume: (resume) => set({ resume }),
	updateResume: (fn) => {
		set((state) => {
			if (!state.resume) return state;
			const updatedData = produce(state.resume.data, fn);
			debouncedSyncResume(state.resume.id, updatedData);
			return { resume: { ...state.resume, data: updatedData } };
		});
	},
}));
