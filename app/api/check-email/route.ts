// app/api/check-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(req: NextRequest) {
	const { email } = await req.json();
	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

	// Use admin credentials server-side
	await pb.admins.authWithPassword(
		process.env.PB_ADMIN_EMAIL!,
		process.env.PB_ADMIN_PASSWORD!,
	);

	try {
		await pb.collection("users_epay").getFirstListItem(`email="${email}"`);
		return NextResponse.json({ exists: true });
	} catch {
		return NextResponse.json({ exists: false });
	}
}
