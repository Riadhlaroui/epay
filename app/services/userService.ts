import {
	getCurrentUserInfo,
	logOutUser,
} from "../infrastructure/repositories/userRepository";

export const logOut = async () => {
	return logOutUser();
};

export const getCurrentUser = async () => {
	return getCurrentUserInfo();
};
