import {
	authenticateUser,
	EmailExists,
	logInWithGoogle,
} from "../infrastructure/repositories/userRepository";

export const SignIn = async (email: string, password: string) => {
	return authenticateUser(email, password);
};

export const SignInWithGoogle = async () => {
	return logInWithGoogle();
};

export const checkEmailExists = async (email: string) => {
	return EmailExists(email);
};
