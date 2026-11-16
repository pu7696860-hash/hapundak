export default { tags: ["section"], layout: "layouts/section.njk", nav: "series", permalink: (d) => `/madur/${d.page.fileSlug}/`, eleventyComputed: { title: (d) => d.name } };
