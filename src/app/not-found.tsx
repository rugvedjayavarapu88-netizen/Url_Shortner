import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>404 — Not found</h1>
      <p>That short link doesn’t exist. Want to <Link href="/">create one</Link>?</p>
    </main>
  );
}
