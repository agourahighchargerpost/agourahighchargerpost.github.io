export const data = { permalink: "/robots.txt", eleventyExcludeFromCollections: true };
export const render = ({ site }) => `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${site.url}/sitemap.xml\n`;
