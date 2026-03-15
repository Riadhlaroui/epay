// app/api/setup-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(req: NextRequest) {
	try {
		const { userId, password } = await req.json();

		const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

		await pb
			.collection("_superusers")
			.authWithPassword(
				process.env.PB_ADMIN_EMAIL!,
				process.env.PB_ADMIN_PASSWORD!,
			);

		await pb.collection("users_epay").update(userId, {
			password,
			passwordConfirm: password,
		});

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("setup-password error:", err);
		return NextResponse.json(
			{ error: "Failed to set password" },
			{ status: 500 },
		);
	}
}
