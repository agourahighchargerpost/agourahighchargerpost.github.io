import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import { wpSlug } from "./lib/text.js";

const PER_PAGE = 10;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const categories = readJSON("src/_data/categoryList.json");
const tagSlugs = readJSON("src/_data/tagSlugs.json");

const pad = (n) => String(n).padStart(2, "0");
const tagSlug = (name) => tagSlugs[name] || wpSlug(name);
const catInfo = (name) => categories.find((c) => c.name === name) || { name, slug: wpSlug(name), id: 0 };

/** Newest first; drafts left out. */
function sortedPosts(api) {
  return api.getFilteredByGlob("src/articles/*.{html,md}")
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.date - a.date);
}

/** WordPress paginate_links() with end_size 1 and mid_size 2. */
function paginationHtml(current, total, base) {
  if (total < 2) return "";
  const url = (n) => (n === 1 ? base : `${base}page/${n}/`);
  const out = [];
  if (current > 1) out.push(`<li><a class="prev page-numbers" href="${url(current - 1)}"><i class="fas fa-chevron-left"></i></a></li>`);
  let dots = false;
  for (let n = 1; n <= total; n++) {
    if (n === current) {
      out.push(`<li><span aria-current="page" class="page-numbers current">${n}</span></li>`);
      dots = true;
    } else if (n <= 1 || (n >= current - 2 && n <= current + 2) || n > total - 1) {
      out.push(`<li><a class="page-numbers" href="${url(n)}">${n}</a></li>`);
      dots = true;
    } else if (dots) {
      out.push(`<li><span class="page-numbers dots">&hellip;</span></li>`);
      dots = false;
    }
  }
  if (current < total) out.push(`<li><a class="next page-numbers" href="${url(current + 1)}"><i class="fas fa-chevron-right"></i></a></li>`);
  return `<div class="pagination"><ul class="page-numbers">\n\t${out.join("\n\t")}\n</ul>\n</div>`;
}

export default function (eleventyConfig) {
  // Files copied to the site exactly as they are.
  for (const p of ["src/wp-content", "src/wp-includes", "src/assets", "src/admin", "src/images", "src/CNAME"]) {
    eleventyConfig.addPassthroughCopy(p);
  }
  // The editor's page must be copied as-is, never processed as a site page.
  eleventyConfig.ignores.add("src/admin/**");

  // ------------------------------------------------------------------ collections
  let writers = new Map();
  eleventyConfig.addCollection("writers", (api) => {
    const list = api.getFilteredByGlob("src/writers/*.md");
    writers = new Map(list.map((w) => [w.fileSlug, w]));
    return list;
  });

  eleventyConfig.addCollection("posts", (api) => sortedPosts(api));

  // Every paginated listing page: homepage pages 2+, categories, tags, years and months.
  eleventyConfig.addCollection("archivePages", (api) => {
    const posts = sortedPosts(api);
    const pages = [];
    const add = (info, list, startAt = 1) => {
      const total = Math.max(1, Math.ceil(list.length / PER_PAGE));
      for (let n = startAt; n <= total; n++) {
        pages.push({
          ...info, n, total,
          url: n === 1 ? info.base : `${info.base}page/${n}/`,
          posts: list.slice((n - 1) * PER_PAGE, n * PER_PAGE),
        });
      }
    };

    add({ kind: "home", base: "/" }, posts, 2);

    const byCat = new Map();
    const byTag = new Map();
    const byYear = new Map();
    const byMonth = new Map();
    const push = (map, key, info, post) => {
      if (!map.has(key)) map.set(key, { info, list: [] });
      map.get(key).list.push(post);
    };
    for (const p of posts) {
      for (const c of p.data.categories || []) {
        const ci = catInfo(c);
        push(byCat, ci.slug, { kind: "category", label: ci.name, slug: ci.slug, id: ci.id, base: `/category/${ci.slug}/` }, p);
      }
      for (const t of p.data.tags || []) {
        const s = tagSlug(t);
        push(byTag, s, { kind: "tag", label: t, slug: s, base: `/tag/${s}/` }, p);
      }
      const d = p.date;
      const y = String(d.getUTCFullYear());
      const m = pad(d.getUTCMonth() + 1);
      push(byYear, y, { kind: "year", label: y, year: y, base: `/${y}/` }, p);
      push(byMonth, `${y}/${m}`, {
        kind: "month", label: `${MONTHS[d.getUTCMonth()]} ${y}`, monthName: MONTHS[d.getUTCMonth()],
        year: y, base: `/${y}/${m}/`,
      }, p);
    }
    for (const map of [byCat, byTag, byYear, byMonth]) {
      for (const { info, list } of map.values()) add(info, list);
    }
    return pages;
  });

  // ------------------------------------------------------------------ filters
  eleventyConfig.addFilter("writer", (slug) => {
    const w = writers.get(slug);
    return w ? { slug, name: w.data.name, url: `/author/${slug}/` } : { slug, name: slug, url: `/author/${slug}/` };
  });
  eleventyConfig.addFilter("postsBy", (posts, slug) => posts.filter((p) => p.data.author === slug));
  eleventyConfig.addFilter("bySlugs", (posts, slugs) =>
    (slugs || []).map((s) => posts.find((p) => p.fileSlug === s)).filter(Boolean));
  // WordPress used the category with the lowest ID in breadcrumbs.
  eleventyConfig.addFilter("primaryCategory", (names) =>
    [...(names || [])].sort((a, b) => (catInfo(a).id || 999) - (catInfo(b).id || 999))[0]);
  eleventyConfig.addFilter("catSlug", (name) => catInfo(name).slug);
  eleventyConfig.addFilter("catId", (name) => catInfo(name).id);
  eleventyConfig.addFilter("tagSlug", tagSlug);

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().replace(/\.\d{3}Z$/, "+00:00"));
  eleventyConfig.addFilter("longDate", (d) => {
    d = new Date(d);
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  });
  // Replaced in the browser by assets/static-site.js so it never goes stale.
  eleventyConfig.addFilter("timeAgo", (d) => {
    const s = (Date.now() - new Date(d).getTime()) / 1000;
    for (const [u, sec] of [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["min", 60]]) {
      const n = Math.floor(s / sec);
      if (n >= 1) return `${n} ${u}${n > 1 ? "s" : ""} ago`;
    }
    return "just now";
  });

  eleventyConfig.addFilter("articleClasses", (post) => {
    const d = post.data;
    return ["post", "type-post", "status-publish", "format-standard", d.image ? "has-post-thumbnail" : "", "hentry",
      ...(d.categories || []).map((c) => `category-${catInfo(c).slug}`),
      ...(d.tags || []).map((t) => `tag-${tagSlug(t)}`),
      `author-${d.author}`].filter(Boolean).join(" ");
  });

  // The two newest other articles that share a category.
  eleventyConfig.addFilter("related", (posts, current) => {
    const cats = new Set(current.data.categories || []);
    return posts.filter((p) => p.url !== current.url && (p.data.categories || []).some((c) => cats.has(c))).slice(0, 2);
  });
  eleventyConfig.addFilter("prevNext", (posts, url) => {
    const i = posts.findIndex((p) => p.url === url);
    return { previous: posts[i + 1] || null, next: i > 0 ? posts[i - 1] : null };
  });
  eleventyConfig.addFilter("archiveMonths", (posts) => {
    const seen = new Map();
    for (const p of posts) {
      const d = p.date;
      const key = `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}`;
      if (!seen.has(key)) seen.set(key, { label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`, url: `/${key}/` });
    }
    return [...seen.values()];
  });
  eleventyConfig.addFilter("shuffle", (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
  eleventyConfig.addFilter("pagination", paginationHtml);
  // Author pages showed about 170 characters, cut at a word boundary.
  eleventyConfig.addFilter("trimChars", (text, n = 170, more = "...") => {
    const t = String(text || "");
    if (t.length <= n) return t;
    const cut = t.slice(0, n + 1);
    return cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : n).replace(/[\s\u00a0]+$/, "") + more;
  });

  // Resize/crop a featured image at build time, like WordPress's generated thumbnail sizes.
  eleventyConfig.addFilter("thumb", async (src, width, height) => {
    if (!src || /^https?:/.test(src)) return src || "";
    let rel = src;
    try { rel = decodeURI(src); } catch { /* keep as written */ }
    const file = path.join("src", rel);
    if (!fs.existsSync(file)) {
      console.warn(`[thumb] image not found: ${src}`);
      return src;
    }
    const stats = await Image(file, {
      widths: [width],
      formats: ["webp"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      // Part of the output filename, so different crops of one image never collide.
      manualCacheKey: `crop-${width}x${height || "auto"}`,
      transform: height
        ? async (sharp) => {
          // Like WordPress: never enlarge, and only crop the side that is too big.
          const meta = await sharp.metadata();
          const dims = meta.autoOrient || meta;
          sharp.resize(Math.min(width, dims.width), Math.min(height, dims.height), { fit: "cover", position: "centre" });
        }
        : undefined,
    });
    return stats.webp[0].url;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    // Article HTML is used exactly as written (no template processing inside it).
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
    templateFormats: ["html", "md", "liquid", "11ty.js"],
  };
}

