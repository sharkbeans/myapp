import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { tradePost, cosmoAccount } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await db.query.tradePost.findMany({
    where: eq(tradePost.userId, session.user.id),
    with: {
      haves: true,
      wants: true,
      user: {
        columns: { id: true, name: true, image: true },
      },
    },
    orderBy: [desc(tradePost.createdAt)],
  });

  const cosmo = await db.query.cosmoAccount.findFirst({
    where: eq(cosmoAccount.userId, session.user.id),
  });

  const enriched = trades.map((t) => ({
    ...t,
    cosmoNickname: cosmo?.nickname ?? null,
  }));

  return NextResponse.json({ trades: enriched });
}
