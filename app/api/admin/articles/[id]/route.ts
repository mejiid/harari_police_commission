import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { slug, imageUrl, isPublished, translations } = await req.json();

  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Editors cannot publish
  if (isPublished && session.user.role === "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const article = await db.article.update({
    where: { id },
    data: {
      slug,
      imageUrl: imageUrl || null,
      isPublished,
      publishedAt: isPublished && !existing.isPublished ? new Date() : existing.publishedAt,
      translations: {
        deleteMany: {},
        create: translations.map((t: { language: string; title: string; summary: string; content: string }) => ({
          language: t.language,
          title: t.title,
          summary: t.summary,
          content: t.content,
        })),
      },
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role === "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
