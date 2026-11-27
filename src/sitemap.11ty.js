export const data = { permalink: "/sitemap.xml", eleventyExcludeFromCollections: true };

export function render({ collections, site }) {
  const urls = new Set(["/"]);
  for (const p of collections.posts) urls.add(p.url);
  for (const w of collections.writers) urls.add(w.url);
  for (const a of collections.archivePages) if (a.n === 1) urls.add(a.url);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    [...urls].map((u) => `  <url><loc>${esc(site.url + u)}</loc></url>`).join("\n")}\n</urlset>\n`;
}
