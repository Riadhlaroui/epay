"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/app/services/authService";
import pb from "@/app/infrastructure/pocketbase/client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		console.log("Attempting to sign in with:", { email, password });

		try {
			// 1. Call your existing SignIn function
			await SignIn(email, password);

			// 2. EXPORT TO COOKIE (Crucial for Middleware)
			// This syncs the PocketBase auth state with the browser cookies
			document.cookie = pb.authStore.exportToCookie({
				httpOnly: false,
				secure: false, // Set to true in production with HTTPS
				sameSite: "Lax",
				path: "/",
			});

			// 3. Redirect to the dashboard
			router.push("/");
			router.refresh(); // Forces Next.js to re-check the middleware
		} catch (err: unknown) {
			setError("Invalid email or password. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground">
						Welcome Back
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Please enter your details to sign in
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleLogin}>
					{error && (
						<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<div className="space-y-4 shadow-sm">
						<div>
							<label className="block text-sm font-medium text-foreground">
								Email address
							</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-foreground">
								Password
							</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							/>
						</div>
					</div>

					<Button
						variant={"default"}
						type="submit"
						disabled={isLoading}
						className="w-full h-10 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</Button>
				</form>

				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						Don&apos;t have an account?{" "}
					</span>
					<a
						href="/signup"
						className="font-medium text-primary hover:underline"
					>
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
}
