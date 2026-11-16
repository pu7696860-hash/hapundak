export default {
  tags: ["issue"],
  layout: "layouts/issue.njk",
  nav: "archive",
  permalink: (d) => `/gilayon/${d.number}/`,
  eleventyComputed: { title: (d) => `גיליון ${d.number}` },
};
