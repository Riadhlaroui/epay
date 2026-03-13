"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/app/services/authService";
import pb from "@/app/infrastructure/pocketbase/client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		console.log("Attempting to sign in with:", { email, password });

		try {
			// 1. Call SignIn function
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
		<div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
			{/* OUTER TRACK: Dark frame with large rounded corners */}
			<div className="w-full max-w-lg rounded-[2.5rem] border border-[#1f1f1f] bg-[#111111] p-3 shadow-2xl">
				{/* INNER CONTENT: The actual form card */}
				<div className="rounded-[2rem] border border-[#2a2a2a] bg-[#141414] p-10 shadow-inner">
					{/* Header */}
					<div className="mb-10 text-center">
						<h2 className="text-3xl font-bold tracking-tight text-white">
							Welcome Back
						</h2>
						<p className="mt-3 text-sm text-[#9b9b9b]">
							Please enter your details to sign in
						</p>
					</div>

					{/* Form */}
					<form className="space-y-6" onSubmit={handleLogin}>
						{error && (
							<div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
								{error}
							</div>
						)}

						<div className="space-y-5">
							{/* Email Field */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#9b9b9b] ml-1">
									Email address
								</label>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="email@example.com"
									className="block h-12 w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#201f1f]  transition-all"
								/>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#9b9b9b] ml-1">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="block h-12 w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 text-white focus:outline-none focus:ring-1 focus:ring-[#201f1f] transition-all"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#555] hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>
						</div>

						{/* Submit Button - Matches the "Upgrade" button style */}
						<button
							type="submit"
							disabled={isLoading}
							className="mt-4 w-full h-12 rounded-xl bg-[#f5f5f7] text-sm font-semibold text-black transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50"
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</form>

					{/* Footer Divider & Link */}
					<div className="mt-8 pt-6 border-t w-full border-[#2a2a2a] text-center text-sm">
						<span className="text-[#9b9b9b]">Don&apos;t have an account? </span>
						<a
							href="/sign-up"
							className="font-medium text-white hover:underline underline-offset-4"
						>
							Sign up
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
