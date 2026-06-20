import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ subscribed: false });
  }
  const sub = await db.subscriber.findUnique({ where: { email } });
  return NextResponse.json({ subscribed: !!sub?.verified, token: sub?.token || null });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  let email: string;
  let name: string | null = null;
  let autoVerify = false;

  if (session?.user?.email) {
    email = session.user.email;
    name = session.user.name || null;
    autoVerify = true;
  } else {
    let body: { email?: string; name?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    email = body.email.toLowerCase().trim();
    name = body.name || null;
  }

  const existing = await db.subscriber.findUnique({ where: { email } });
  if (existing?.verified) {
    return NextResponse.json({ message: "You are already subscribed!" });
  }

  const subscriber = await db.subscriber.upsert({
    where: { email },
    update: { name, verified: autoVerify || undefined },
    create: { email, name, verified: autoVerify },
  });

  if (autoVerify) {
    return NextResponse.json({ message: "Subscribed! You will receive new posts by email." });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://idrissamaiga.iditechs.com";
  const verifyUrl = `${baseUrl}/api/subscribe/verify?token=${subscriber.token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Idrissa Maiga" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirm your subscription",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #0a0f1e; color: #e5e7eb; border-radius: 12px;">
        <h2 style="color: #60a5fa; margin-bottom: 16px;">Confirm your subscription</h2>
        <p>Hey${name ? ` ${name}` : ""},</p>
        <p>Thanks for subscribing to my blog. Click below to confirm and start receiving new posts by email.</p>
        <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 28px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Confirm Subscription</a>
        <p style="font-size: 13px; color: #6b7280; margin-top: 24px;">If you did not subscribe, just ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ message: "Check your email to confirm your subscription." });
}

export async function DELETE(req: NextRequest) {
  const { token } = await req.json().catch(() => ({ token: null }));
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const subscriber = await db.subscriber.findUnique({ where: { token } });
  if (!subscriber) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  await db.subscriber.delete({ where: { token } });
  return NextResponse.json({ message: "Unsubscribed successfully." });
}
