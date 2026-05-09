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

  const { slug, imageUrl, isPublished, translations } = await req.json();

  if (!slug || !translations?.length) {
    return NextResponse.json({ error: "Slug and translations are required" }, { status: 400 });
  }

  const article = await db.article.create({
    data: {
      slug,
      imageUrl: imageUrl || null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      createdById: session.user.id,
      translations: {
        create: translations.map((t: { language: string; title: string; summary: string; content: string }) => ({
          language: t.language,
          title: t.title,
          summary: t.summary,
          content: t.content,
        })),
      },
    },
  });

  return NextResponse.json(article, { status: 201 });
}
