// @ts-check

/** @type {import('npm-check-updates').RunOptions} */
module.exports = {
	upgrade: true,
	install: "always",
	packageManager: "bun",
	reject: [
		"better-auth", // fixed version to 1.4.1 until https://github.com/better-auth/better-auth/issues/6341 is resolved
		"@better-auth/passkey", // fixed version to 1.4.1 until https://github.com/better-auth/better-auth/issues/6341 is resolved
		"@tanstack/react-query", // orpc needs @tanstack/react-query@5.90.7
	],
};
