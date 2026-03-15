"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	SignIn,
	SignUp,
	SignInWithGoogle,
	SetupGoogleUserPassword,
} from "@/app/services/authService";
import pb from "@/app/infrastructure/pocketbase/client";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";
import { checkEmailExists } from "@/app/services/authService";
import { ThemeToggle } from "@/components/theme-toggle";

const cormorant = Cormorant_Garamond({
	subsets: ["latin"],
	weight: "400",
	style: "italic",
});

type Step = "initial" | "signin" | "signup" | "setup";

export default function SignInPage() {
	const [step, setStep] = useState<Step>("initial");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const router = useRouter();

	const exportCookieAndRedirect = () => {
		document.cookie = pb.authStore.exportToCookie({
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			path: "/",
		});
		router.push("/");
		router.refresh();
	};

	const handleGoogleLogin = async () => {
		setIsLoading(true);
		try {
			const authData = await SignInWithGoogle();

			if (authData.meta?.isNew) {
				setStep("setup");
			} else {
				exportCookieAndRedirect();
			}
		} catch (err) {
			// Silently ignore popup closed errors
			const message = err instanceof Error ? err.message : String(err);
			if (
				message.includes("popup") ||
				message.includes("closed") ||
				message.includes("cancelled") ||
				message.includes("canceled")
			) {
				return;
			}
			setError("Google sign-in failed. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailContinue = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			const exists = await checkEmailExists(email);
			console.log("Email exists:", exists);
			setStep(exists ? "signin" : "signup");
		} catch (err) {
			setError("Something went wrong. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			await SignIn(email, password);
			exportCookieAndRedirect();
		} catch (err) {
			setError("Invalid email or password. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			await SignUp(email, password, name);
			exportCookieAndRedirect();
		} catch (err) {
			setError("Could not create account. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSetupPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			await SetupGoogleUserPassword(password);
			exportCookieAndRedirect();
		} catch (err) {
			setError("Could not set password. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const headings: Record<Step, { title: string; subtitle: string }> = {
		initial: { title: "Welcome", subtitle: "Sign in or create an account" },
		signin: { title: "Welcome Back", subtitle: `Signing in as ${email}` },
		signup: {
			title: "Create Account",
			subtitle: `Setting up account for ${email}`,
		},
		setup: {
			title: "One Last Step",
			subtitle: "Set a password for your account",
		},
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-[#f5f5f7] dark:bg-[#0a0a0a] p-6">
			<div className="absolute top-4 right-4">
				<ThemeToggle />
			</div>

			<div className="w-full max-w-lg rounded-[2.5rem] border border-[#d1d1d6] dark:border-[#1f1f1f] bg-white dark:bg-[#111111] p-3 shadow-2xl">
				<div className="rounded-[2rem] border border-[#e5e5ea] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#141414] p-10 shadow-inner">
					{/* Back button */}
					{step !== "initial" && (
						<button
							type="button"
							onClick={() => {
								setStep("initial");
								setError("");
								setPassword("");
								setConfirmPassword("");
							}}
							className="mb-6 flex items-center gap-1.5 text-sm text-[#6b6b6b] dark:text-[#9b9b9b] hover:text-black dark:hover:text-white transition-colors"
						>
							<ArrowLeft size={15} />
							Back
						</button>
					)}

					{/* Header */}
					<div className="mb-10 text-center">
						<h2
							className={`${cormorant.className} text-4xl tracking-tight text-black dark:text-white`}
						>
							{headings[step].title}
						</h2>
						<p className="mt-3 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
							{headings[step].subtitle}
						</p>
					</div>

					{error && (
						<div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500 dark:text-red-400">
							{error}
						</div>
					)}

					{/* Step 1 — Initial */}
					{step === "initial" && (
						<div className="space-y-4">
							<button
								type="button"
								onClick={handleGoogleLogin}
								disabled={isLoading}
								className="w-full h-12 rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] text-black dark:text-white font-medium text-base flex items-center justify-center gap-3 hover:bg-[#f5f5f7] dark:hover:bg-[#1a1a1a] transition-all active:scale-[0.98] disabled:opacity-50"
							>
								{isLoading ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										className="h-5 w-5"
									>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								)}
								Continue with Google
							</button>

							<div className="flex items-center gap-3">
								<div className="flex-1 h-px bg-[#d1d1d6] dark:bg-[#2a2a2a]" />
								<span className="text-base text-[#6b6b6b] dark:text-[#f5f5f5]">
									or
								</span>
								<div className="flex-1 h-px bg-[#d1d1d6] dark:bg-[#2a2a2a]" />
							</div>

							<form onSubmit={handleEmailContinue} className="space-y-4">
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
								/>
								<button
									type="submit"
									disabled={isLoading}
									className="text-base w-full h-12 rounded-xl bg-[#111] dark:bg-[#f5f5f7] font-semibold text-white dark:text-black transition-all hover:bg-[#333] dark:hover:bg-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{isLoading ? "Checking..." : "Continue with email"}
									{isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
								</button>
							</form>
						</div>
					)}

					{/* Step 2a — Sign In */}
					{step === "signin" && (
						<form onSubmit={handleSignIn} className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
										autoFocus
									/>
									<button
										type="button"
										onClick={() => setShowPassword((p) => !p)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#aaa] dark:text-[#555] hover:text-black dark:hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="text-lg w-full h-12 rounded-xl bg-[#111] dark:bg-[#f5f5f7] font-semibold text-white dark:text-black transition-all hover:bg-[#333] dark:hover:bg-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{isLoading ? "Signing in..." : "Sign in"}
								{isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
							</button>
						</form>
					)}

					{/* Step 2b — Sign Up */}
					{step === "signup" && (
						<form onSubmit={handleSignUp} className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Full Name
								</label>
								<input
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
									className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
									autoFocus
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Create a password"
										className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((p) => !p)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#aaa] dark:text-[#555] hover:text-black dark:hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="Confirm your password"
										className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword((p) => !p)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#aaa] dark:text-[#555] hover:text-black dark:hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="text-lg w-full h-12 rounded-xl bg-[#111] dark:bg-[#f5f5f7] font-semibold text-white dark:text-black transition-all hover:bg-[#333] dark:hover:bg-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{isLoading ? "Creating account..." : "Create account"}
								{isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
							</button>
						</form>
					)}

					{/* Step 3 — Setup Password (Google new users) */}
					{step === "setup" && (
						<form onSubmit={handleSetupPassword} className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Create a password"
										className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
										autoFocus
									/>
									<button
										type="button"
										onClick={() => setShowPassword((p) => !p)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#aaa] dark:text-[#555] hover:text-black dark:hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] ml-1">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="Confirm your password"
										className="block h-12 w-full rounded-xl border border-[#d1d1d6] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] px-4 text-black dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#c0c0c0] dark:focus:ring-[#201f1f] transition-all"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword((p) => !p)}
										className="absolute inset-y-0 right-0 flex items-center px-4 text-[#aaa] dark:text-[#555] hover:text-black dark:hover:text-[#9b9b9b]"
										tabIndex={-1}
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>

							<p className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b]">
								This lets you sign in with your email and password in addition
								to Google.
							</p>

							<button
								type="submit"
								disabled={isLoading}
								className="text-lg w-full h-12 rounded-xl bg-[#111] dark:bg-[#f5f5f7] font-semibold text-white dark:text-black transition-all hover:bg-[#333] dark:hover:bg-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{isLoading ? "Saving..." : "Set password & continue"}
								{isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
							</button>
						</form>
					)}

					{/* Footer */}
					<div className="mt-8 pt-6 border-t w-full border-[#e5e5ea] dark:border-[#2a2a2a] text-center text-sm">
						<span className="text-[#6b6b6b] dark:text-[#9b9b9b]">
							{step === "signup"
								? "Already have an account? "
								: "Don't have an account? "}
						</span>
						<button
							type="button"
							onClick={() => {
								setStep("initial");
								setError("");
								setPassword("");
								setConfirmPassword("");
							}}
							className="font-medium text-black dark:text-white hover:underline underline-offset-4"
						>
							{step === "signup" ? "Sign in" : "Sign up"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
