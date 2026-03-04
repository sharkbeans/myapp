import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { searchUsers } from "@/lib/cosmo/client";

export async function GET(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  try {
    const result = await searchUsers(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cosmo search failed:", error);
    return NextResponse.json(
      { error: "Failed to search Cosmo users" },
      { status: 502 }
    );
  }
}
