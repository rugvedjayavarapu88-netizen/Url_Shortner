import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory token buckets (fine for dev/single instance)
const buckets = new Map<string, { tokens: number; ts: number }>();
const RATE = { capacity: 10, refillPerSec: 0.5 }; // ~30 req/min

export function middleware(req: NextRequest) {
  if (req.method === "POST" && req.nextUrl.pathname.startsWith("/api/links")) {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const now = Date.now() / 1000;

    const b = buckets.get(ip) ?? { tokens: RATE.capacity, ts: now };
    const tokens = Math.min(RATE.capacity, b.tokens + (now - b.ts) * RATE.refillPerSec);

    if (tokens < 1) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    buckets.set(ip, { tokens: tokens - 1, ts: now });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/links"],
};
