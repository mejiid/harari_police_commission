import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { isActive, role } = await req.json();

  const data: { isActive?: boolean; role?: "SUPER_ADMIN" | "EDITOR" } = {};
  if (typeof isActive === "boolean") data.isActive = isActive;
  if (role) data.role = role;

  await db.user.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
