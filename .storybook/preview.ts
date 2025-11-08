import "../src/styles.css";

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: "todo",
		},
	},
};

export const decorators: Decorator[] = [
	withThemeByClassName({
		defaultTheme: "dark",
		themes: {
			light: "light",
			dark: "dark",
		},
	}),
];

export default preview;
