// Everything the in-browser search needs, built from the articles.
export const data = { permalink: "/assets/search-index.json", eleventyExcludeFromCollections: true };

export function render({ collections }) {
  const writers = new Map(collections.writers.map((w) => [w.fileSlug, w.data.name]));
  return JSON.stringify(collections.posts.map((p) => ({
    title: p.data.title,
    url: p.url,
    date: p.date.toISOString(),
    author: writers.get(p.data.author) || "",
    categories: p.data.categories || [],
    image: p.data.image || "",
    excerpt: p.data.excerptText,
    content: p.data.plainText,
  })));
}
