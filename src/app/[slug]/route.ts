import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// Note: This runs on the Node runtime (default), not Edge.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fire-and-forget: don't block the redirect while we log
  logClick(req, link.id).catch(() => {});

  return NextResponse.redirect(link.longUrl, { status: 301 });
}

async function logClick(req: NextRequest, linkId: string) {
  const ip = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
  const referrer = req.headers.get("referer") ?? undefined;

  await prisma.click.create({
    data: { linkId, ipHash, referrer },
  });
}
