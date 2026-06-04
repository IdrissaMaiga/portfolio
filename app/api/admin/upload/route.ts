import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    const { action, prompt, filename } = body;

    if (action === "generate-image" && prompt) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: { sampleCount: 1, aspectRatio: "16:9" },
          }),
        }
      );

      if (!geminiRes.ok) {
        const err = await geminiRes.text();
        return NextResponse.json({ error: "Image generation failed", details: err }, { status: 500 });
      }

      const geminiData = await geminiRes.json();
      const base64 = geminiData.predictions?.[0]?.bytesBase64Encoded;
      if (!base64) {
        return NextResponse.json({ error: "No image returned from Gemini" }, { status: 500 });
      }

      const imageBuffer = Buffer.from(base64, "base64");
      const key = `blog/${filename || `generated-${Date.now()}.png`}`;
      const url = await uploadToR2(key, imageBuffer, "image/png");

      return NextResponse.json({ success: true, url, key });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "png";
    const key = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const url = await uploadToR2(key, buffer, file.type || `image/${ext}`);

    return NextResponse.json({ success: true, url, key });
  }

  return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
}
