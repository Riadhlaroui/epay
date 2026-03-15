import pb from "../pocketbase/client";

export async function authenticateUser(email: string, password: string) {
	try {
		const authData = await pb
			.collection("users_epay")
			.authWithPassword(email, password);
		return authData;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error;
	}
}

export async function registerUser(
	email: string,
	password: string,
	fullName: string,
	phoneNumber?: string,
) {
	try {
		const user = await pb.collection("users_epay").create({
			email,
			password,
			passwordConfirm: password,
			FullName: fullName,
			phoneNumber: phoneNumber,
		});

		console.log("User registered:", user);

		// Auto sign in after registration
		const authData = await pb
			.collection("users_epay")
			.authWithPassword(email, password);

		return authData;
	} catch (error) {
		console.error("Registration failed:", error);
		throw error;
	}
}

export async function logInWithGoogle() {
	try {
		const authGoogleData = await pb
			.collection("users_epay")
			.authWithOAuth2({ provider: "google" });

		const name = authGoogleData.meta?.name;

		if (name) {
			try {
				await pb.collection("users_epay").update(authGoogleData.record.id, {
					FullName: name,
				});
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

export async function SetUpGoogleLoginPassword(
	password: string,
): Promise<void> {
	try {
		const userId = pb.authStore.record!.id;

		const res = await fetch("/api/setup-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, password }),
		});

		if (!res.ok) throw new Error("Failed to set password");
	} catch (error) {
		console.error("Could not set password:", error);
		throw error;
	}
}

export async function EmailExists(email: string): Promise<boolean> {
	const res = await fetch("/api/check-email", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	const data = await res.json();
	return data.exists;
}

export async function getCurrentUserInfo() {
	try {
		if (!pb.authStore.isValid || !pb.authStore.record) {
			throw new Error("No authenticated user found.");
		}
		const user = await pb
			.collection("users_epay")
			.getOne(pb.authStore.record.id, { requestKey: null });

		return user;
	} catch (error) {
		console.error("Could not get current user info:", error);
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
