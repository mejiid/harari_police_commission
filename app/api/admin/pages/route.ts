import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pageKey, contents } = await req.json();

  await Promise.all(
    Object.entries(contents).map(([language, content]) =>
      db.pageContent.upsert({
        where: { pageKey_language: { pageKey, language: language as "en" | "am" | "har" | "orm" } },
        update: { content: content as string },
        create: { pageKey, language: language as "en" | "am" | "har" | "orm", content: content as string },
      })
    )
  );

  return NextResponse.json({ success: true });
}
