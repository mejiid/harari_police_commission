import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileUrl, isPublished, translations } = await req.json();
  if (!fileUrl) return NextResponse.json({ error: "File URL is required" }, { status: 400 });

  const report = await db.report.create({
    data: {
      fileUrl,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      createdById: session.user.id,
      translations: {
        create: translations.map((t: { language: string; title: string; description: string }) => ({
          language: t.language,
          title: t.title,
          description: t.description,
        })),
      },
    },
  });

  return NextResponse.json(report, { status: 201 });
}
