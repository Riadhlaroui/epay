import { logOutUser } from "../infrastructure/repositories/userRepository";

export const logOut = async () => {
	return logOutUser();
};
