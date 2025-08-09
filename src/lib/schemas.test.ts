import { describe, it, expect } from "vitest";
import { createLinkInput } from "./schemas";

describe("createLinkInput", () => {
  it("accepts a valid URL and optional slug", () => {
    const r = createLinkInput.safeParse({
      longUrl: "https://example.com/path?x=1",
      slug: "my-slug_123",
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid URLs", () => {
    const r = createLinkInput.safeParse({ longUrl: "not-a-url" });
    expect(r.success).toBe(false);
  });

  it("rejects bad slugs", () => {
    const r = createLinkInput.safeParse({
      longUrl: "https://example.com",
      slug: "no spaces!",
    });
    expect(r.success).toBe(false);
  });
});
