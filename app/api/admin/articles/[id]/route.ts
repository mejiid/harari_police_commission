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
  let { slug, images, isPublished, translations } = await req.json();

  // Clean slug
  slug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update article
  try {
    const article = await db.article.update({
      where: { id },
      data: {
        slug,
        images: images || [],
        isPublished,
        publishedAt: isPublished && !existing.isPublished ? new Date() : existing.publishedAt,
        translations: {
          deleteMany: {},
          create: translations
            .filter((t: any) => t.title.trim() !== "") // Only save non-empty translations
            .map((t: { language: string; title: string; summary: string; content: string }) => ({
              language: t.language,
              title: t.title,
              summary: t.summary,
              content: t.content,
            })),
        },
      },
    });
    return NextResponse.json(article);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Another article is already using this URL slug." }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error occurred while saving." }, { status: 500 });
  }
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
