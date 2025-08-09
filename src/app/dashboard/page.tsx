// Server component
import { prisma } from "@/lib/db";

export default async function Dashboard() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const rows = await Promise.all(
    links.map(async (l) => {
      const totalClicks = await prisma.click.count({ where: { linkId: l.id } });
      const last = await prisma.click.findFirst({
        where: { linkId: l.id },
        orderBy: { ts: "desc" },
        select: { ts: true },
      });
      return {
        id: l.id,
        slug: l.slug,
        longUrl: l.longUrl,
        createdAt: l.createdAt,
        totalClicks,
        lastClickAt: last?.ts ?? null,
      };
    })
  );

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h2>Your Links</h2>
      <p>
        <a href="/">← Create another link</a>
      </p>
      <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Slug</th>
            <th>URL</th>
            <th>Clicks</th>
            <th>Last Click</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>/{r.slug}</td>
              <td style={{ maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.longUrl}
              </td>
              <td>{r.totalClicks}</td>
              <td>{r.lastClickAt ? r.lastClickAt.toISOString() : "-"}</td>
              <td>{r.createdAt.toISOString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
