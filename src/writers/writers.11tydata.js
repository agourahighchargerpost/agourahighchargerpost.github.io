// Each writer profile becomes their author page at /author/<file-name>/.
export default {
  layout: "layouts/author.liquid",
  permalink: (data) => `/author/${data.page.fileSlug}/`,
};
