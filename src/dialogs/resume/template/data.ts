import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { Template } from "@/schema/templates";

export type TemplateMetadata = {
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
};

export const templates = {
	azurill: {
		name: "Azurill",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/azurill.jpg",
		tags: [],
	},
	bronzor: {
		name: "Bronzor",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/bronzor.jpg",
		tags: [],
	},
	chikorita: {
		name: "Chikorita",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/chikorita.jpg",
		tags: [],
	},
	ditto: {
		name: "Ditto",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/ditto.jpg",
		tags: [],
	},
	gengar: {
		name: "Gengar",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/gengar.jpg",
		tags: [],
	},
	glalie: {
		name: "Glalie",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/glalie.jpg",
		tags: [],
	},
	kakuna: {
		name: "Kakuna",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/kakuna.jpg",
		tags: [],
	},
	lapras: {
		name: "Lapras",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/lapras.jpg",
		tags: [],
	},
	leafish: {
		name: "Leafish",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/leafish.jpg",
		tags: [],
	},
	onyx: {
		name: "Onyx",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/onyx.jpg",
		tags: [],
	},
	pikachu: {
		name: "Pikachu",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/pikachu.jpg",
		tags: [],
	},
	rhyhorn: {
		name: "Rhyhorn",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/rhyhorn.jpg",
		tags: [],
	},
} as const satisfies Record<Template, TemplateMetadata>;
