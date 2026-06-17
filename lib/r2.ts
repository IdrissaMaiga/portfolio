const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const BUCKET = "portfolio-uploads";
const PUBLIC_URL = "https://pub-5dbae7ae21f345449868f710152b690e.r2.dev";

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string = "image/png"
): Promise<string> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${key.split("/").map(encodeURIComponent).join("/")}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": contentType,
      },
      body,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`R2 upload failed: ${err}`);
  }

  return `${PUBLIC_URL}/${key}`;
}

export async function readFromR2(key: string): Promise<string | null> {
  const url = `${PUBLIC_URL}/${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.text();
}

export async function deleteFromR2(key: string): Promise<void> {
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${key.split("/").map(encodeURIComponent).join("/")}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    }
  );
}

export function getR2PublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
