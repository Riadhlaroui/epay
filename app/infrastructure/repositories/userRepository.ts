import { ClientResponseError } from "pocketbase";
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

export async function logInWithGoogle() {
	try {
		const authGoogleData = await pb
			.collection("users_epay")
			.authWithOAuth2({ provider: "google" });

		console.log("meta:", authGoogleData.meta); // check what Google returns

		const name = authGoogleData.meta?.name;

		if (name) {
			try {
				await pb.collection("users_epay").update(authGoogleData.record.id, {
					FullName: name,
				});
				console.log("FullName updated to:", name);
			} catch (updateError) {
				console.error("Failed to update FullName:", updateError);
			}
		}

		document.cookie = pb.authStore.exportToCookie({
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			path: "/",
		});

		return authGoogleData;
	} catch (error) {
		console.error("Google login failed:", error);
		throw error;
	}
}

export async function EmailExists(email: string): Promise<boolean> {
	try {
		await pb.collection("users_epay").getFirstListItem(`email="${email}"`);
		return true;
	} catch (error: unknown) {
		if (error instanceof ClientResponseError && error.status === 404) {
			return false;
		}
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
