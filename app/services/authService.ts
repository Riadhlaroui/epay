import {
	authenticateUser,
	EmailExists,
	logInWithGoogle,
	registerUser,
	SetUpGoogleLoginPassword,
} from "../infrastructure/repositories/userRepository";

export const SignIn = async (email: string, password: string) => {
	return authenticateUser(email, password);
};

export const SignUp = async (
	email: string,
	password: string,
	fullName: string,
) => {
	return registerUser(email, password, fullName);
};

export const SignInWithGoogle = async () => {
	return logInWithGoogle();
};

export const SetupGoogleUserPassword = async (password: string) => {
	return SetUpGoogleLoginPassword(password);
};

export const checkEmailExists = async (email: string) => {
	return EmailExists(email);
};
