import { authenticateUser } from "../infrastructure/repositories/userRepository";

export const SignIn = async (email: string, password: string) => {
	return authenticateUser(email, password);
};
