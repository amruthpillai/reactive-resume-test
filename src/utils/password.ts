const HASH_ALGORITHM: Bun.Password.AlgorithmLabel = "bcrypt";

export const hashPassword = (password: string): Promise<string> => Bun.password.hash(password, HASH_ALGORITHM);

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> =>
	Bun.password.verify(password, passwordHash, HASH_ALGORITHM);
