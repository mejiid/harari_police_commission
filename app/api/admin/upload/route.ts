import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const isPDF = file.type === "application/pdf";

  if (!isImage && !isPDF) {
    return NextResponse.json({ error: "Only images (JPG, PNG, WebP) and PDF files are allowed" }, { status: 400 });
  }

  const folder = isImage ? "articles" : "reports";
  const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}

