import cats from "../_data/cats.js";
export default {
  tags: ["piece"],
  layout: "layouts/piece.njk",
  permalink: (d) => `/p/${d.page.fileSlug}/`,
  eleventyComputed: { nav: (d) => (cats.find((c) => c.kinds.includes(d.kind)) || cats[1]).key },
};
