// Small text helpers shared by the Eleventy config and data files.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", hellip: "…", ndash: "–", mdash: "—" };

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** Article HTML to plain text. */
export function toText(html = "") {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      // Inline tags vanish ("<em>really</em>?" -> "really?"); block tags separate words.
      .replace(/<\/?(p|div|h[1-6]|li|ul|ol|blockquote|figure|figcaption|table|tr|td|th|br|hr|img|section|article|header|footer|pre)\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  ).replace(/[ \t\n\r]+/g, " ").trim(); // like WordPress, a non-breaking space is not a word break
}

/** WordPress-style automatic excerpt: the first 55 words. */
export function makeExcerpt(html, words = 55) {
  const list = toText(html).split(" ").filter(Boolean);
  return list.length > words ? list.slice(0, words).join(" ") + "…" : list.join(" ");
}

/** Minutes to read, matching the old theme's estimate closely. */
export function readTime(html) {
  return Math.max(1, Math.floor(toText(html).split(" ").filter(Boolean).length / 115));
}

/** Turn a category or tag name into a URL slug the way WordPress does. */
export function wpSlug(name = "") {
  return decodeEntities(String(name))
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['"‘’“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
