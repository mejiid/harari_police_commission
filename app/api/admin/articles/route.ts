import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await db.article.findMany({
    include: { translations: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let { slug, images, isPublished, translations } = await req.json();

  // Clean slug
  slug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

  if (!slug || !translations?.length) {
    return NextResponse.json({ error: "Slug and translations are required" }, { status: 400 });
  }

  try {
    const article = await db.article.create({
      data: {
        slug,
        images: images || [],
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        createdById: session.user.id,
        translations: {
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

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Another article is already using this URL slug." }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error occurred while saving." }, { status: 500 });
  }
}

