import { describe, it, expect } from "vitest";
import { randSlug } from "./slug";

describe("randSlug", () => {
  it("creates alphanumeric slugs of given length", () => {
    const s = randSlug(10);
    expect(s).toMatch(/^[a-zA-Z0-9]{10}$/);
  });
});
