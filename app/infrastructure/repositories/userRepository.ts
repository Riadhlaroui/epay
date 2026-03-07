import pb from "../pocketbase/client";

export async function authenticateUser(email: string, password: string) {
	try {
		const authData = await pb
			.collection("users_epay")
			.authWithPassword(email, password);
		console.log("Authentication data:", authData);
		return authData;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error;
	}
}

export async function logOutUser() {
	try {
		pb.authStore.clear();

		document.cookie =
			"pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	} catch (error) {
		console.error("Logout failed:", error);
		throw error;
	}
}
