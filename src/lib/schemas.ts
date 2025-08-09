import { z } from "zod";

export const createLinkInput = z.object({
  longUrl: z.string().url(),
  slug: z.string().min(3).max(32).regex(/^[a-zA-Z0-9-_]+$/).optional(),
});
