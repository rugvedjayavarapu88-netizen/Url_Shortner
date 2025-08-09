import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createLinkInput } from "@/lib/schemas";
import { randSlug } from "@/lib/slug";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { longUrl, slug } = createLinkInput.parse(body);
    const finalSlug = slug ?? (await uniqueSlug());

    const link = await prisma.link.create({ data: { slug: finalSlug, longUrl } });

    return NextResponse.json(
      { id: link.id, slug: finalSlug, shortUrl: `/${finalSlug}` },
      { status: 201 }
    );
  } catch (err: any) {
    const message = err?.issues?.[0]?.message ?? err?.message ?? "Bad Request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function uniqueSlug() {
  for (let i = 0; i < 5; i++) {
    const s = randSlug();
    const exists = await prisma.link.findUnique({ where: { slug: s }, select: { id: true } });
    if (!exists) return s;
  }
  throw new Error("Could not generate unique slug");
}
