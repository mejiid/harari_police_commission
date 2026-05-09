import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend, COMMISSION_EMAIL } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  // Rate limit: 5 submissions per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(ip, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const name = sanitizeText(body.name);
    const email = sanitizeEmail(body.email);
    const subject = sanitizeText(body.subject);
    const message = sanitizeText(body.message);

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Save to DB
    await db.contactSubmission.create({
      data: { name, email, subject, message },
    });

    // Send email
    await resend.emails.send({
      from: "Prison Police Commission <noreply@prisoncommission.gov.et>",
      to: COMMISSION_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
