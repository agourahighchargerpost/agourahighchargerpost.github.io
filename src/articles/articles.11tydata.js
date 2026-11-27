import { makeExcerpt, readTime, toText } from "../../lib/text.js";

// Settings shared by every article in this folder.
export default {
  layout: "layouts/post.liquid",
  eleventyComputed: {
    // Drafts are saved but not published.
    permalink: (data) => (data.draft ? false : `/${data.page.fileSlug}/`),
    excerptText: (data) => data.summary || makeExcerpt(data.page.rawInput),
    // Articles moved from WordPress keep the read time WordPress showed.
    readMinutes: (data) => data.legacyReadTimes[data.page.fileSlug] || readTime(data.page.rawInput),
    plainText: (data) => toText(data.page.rawInput),
  },
};
