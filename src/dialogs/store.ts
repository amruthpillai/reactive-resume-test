import z from "zod";
import { create } from "zustand";
import { profileItemSchema } from "@/schema/resume/data";

const dialogTypeSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("auth.change-password"), data: z.undefined() }),
	z.object({ type: z.literal("auth.two-factor.enable"), data: z.undefined() }),
	z.object({ type: z.literal("auth.two-factor.disable"), data: z.undefined() }),
	z.object({ type: z.literal("resume.create"), data: z.undefined() }),
	z.object({
		type: z.literal("resume.update"),
		data: z.object({ id: z.string(), name: z.string(), slug: z.string(), tags: z.array(z.string()) }),
	}),
	z.object({ type: z.literal("resume.sections.profiles.create"), data: profileItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.profiles.update"), data: profileItemSchema }),
]);

type DialogType = z.infer<typeof dialogTypeSchema>;

type DialogData<T extends DialogType["type"]> = Extract<DialogType, { type: T }>["data"];

// biome-ignore lint/complexity/noBannedTypes: {} is the appropriate type for this case
type DialogPropsData<T extends DialogType["type"]> = DialogData<T> extends undefined ? {} : { data: DialogData<T> };

export type DialogProps<T extends DialogType["type"]> = DialogPropsData<T> & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

interface DialogStoreState {
	open: boolean;
	activeDialog: DialogType | null;
}

interface DialogStoreActions {
	onOpenChange: (open: boolean) => void;
	openDialog: <T extends DialogType["type"]>(type: T, data: DialogData<T>) => void;
	closeDialog: () => void;
}

type DialogStore = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStore>((set) => {
	let closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

	const clearactiveDialog = () => {
		if (closeTimeoutId) clearTimeout(closeTimeoutId);

		closeTimeoutId = setTimeout(() => {
			set({ activeDialog: null });
			closeTimeoutId = null;
		}, 300);
	};

	return {
		open: false,
		activeDialog: null,
		onOpenChange: (open) => {
			set({ open });
			if (!open) clearactiveDialog();
		},
		openDialog: (type, data) =>
			set({
				open: true,
				activeDialog: { type, data } as DialogType,
			}),
		closeDialog: () => {
			set({ open: false });
			clearactiveDialog();
		},
	};
});
