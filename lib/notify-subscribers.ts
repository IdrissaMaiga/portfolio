import { db } from "./db";
import nodemailer from "nodemailer";

export async function notifySubscribers(post: {
  title: string;
  slug: string;
  description: string;
  image?: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const subscribers = await db.subscriber.findMany({ where: { verified: true } });
  if (subscribers.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const baseUrl = "https://idrissamaiga.iditechs.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const results = await Promise.allSettled(
    subscribers.map((sub) => {
      const unsubscribeUrl = `${baseUrl}/api/subscribe/verify?token=${sub.token}&action=unsubscribe`;
      return transporter.sendMail({
        from: `"Idrissa Maiga" <${process.env.EMAIL_USER}>`,
        to: sub.email,
        subject: `New Post: ${post.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e5e7eb; border-radius: 12px; overflow: hidden;">
            ${post.image ? `<img src="${post.image}" alt="" style="width: 100%; height: 200px; object-fit: cover;" />` : ""}
            <div style="padding: 24px 30px 30px;">
              <p style="font-size: 13px; color: #60a5fa; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">New Blog Post</p>
              <h1 style="color: white; font-size: 22px; margin: 0 0 12px;">${post.title}</h1>
              <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 24px;">${post.description}</p>
              <a href="${postUrl}" style="display: inline-block; padding: 12px 28px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Read Post</a>
              <p style="font-size: 11px; color: #4b5563; margin-top: 32px; border-top: 1px solid #1f2937; padding-top: 16px;">
                You received this because you subscribed to updates from Idrissa Maiga.<br />
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `,
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`Notified ${sent} subscribers, ${failed} failed`);
}
