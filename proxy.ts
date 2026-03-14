import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	// 1. Grab the PocketBase auth cookie
	const authCookie = request.cookies.get("pb_auth");
	const { pathname } = request.nextUrl;

	// 2. Define protected and public routes
	// Add any other routes you want to protect to this list
	const isProtectedRoute =
		pathname === "/" || pathname.startsWith("/dashboard");
	const isAuthRoute =
		pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

	// 3. Logic: If trying to access a protected route without a session
	if (isProtectedRoute && !authCookie) {
		const url = new URL("/sign-in", request.url);
		return NextResponse.redirect(url);
	}

	// 4. Logic: If already logged in but trying to go to login/signup pages
	if (isAuthRoute && authCookie) {
		const url = new URL("/", request.url);
		return NextResponse.redirect(url);
	}

	// 5. Allow the request to continue if none of the above match
	return NextResponse.next();
}

// 6. The Matcher: Tells Next.js NOT to run this on images, static files, etc.
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
