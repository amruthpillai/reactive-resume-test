// @ts-check

const nextPackages = ["@monaco-editor/react"];

const betaPackages = ["drizzle-orm", "drizzle-kit"];

const rejectedPackages = ["better-auth", "@better-auth/core", "@better-auth/passkey", "@tanstack/react-query"];

/** @type {import('npm-check-updates').RunOptions} */
module.exports = {
	cooldown: 1,
	upgrade: true,
	install: "always",
	packageManager: "bun",
	reject: rejectedPackages,
	target: (packageName) => {
		if (nextPackages.includes(packageName)) return "@next";
		if (betaPackages.includes(packageName)) return "@beta";
		return "latest";
	},
};
