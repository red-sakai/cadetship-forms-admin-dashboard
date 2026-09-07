import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("admin_auth")?.value === "1";

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.json({ ok: true });
}
