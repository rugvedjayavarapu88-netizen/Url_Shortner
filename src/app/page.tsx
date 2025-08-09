"use client";
import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setShortUrl(null); setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, slug: slug || undefined }),
      });
      const j = await res.json();
      if (res.ok) setShortUrl(`${location.origin}/${j.slug}`);
      else setErr(j.error || "Something went wrong");
    } catch (e: any) {
      setErr(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Shorty</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="https://example.com/..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <input
          placeholder="custom-slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create short link"}
        </button>
      </form>
      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </main>
  );
}
