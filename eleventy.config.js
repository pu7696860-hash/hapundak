import { HtmlBasePlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";
const mdLib = markdownIt({ breaks: true });
import cats from "./src/_data/cats.js";

const kindToCat = (kind) => cats.find((c) => c.kinds.includes(kind)) || cats[1];

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // every new line in a piece stays a new line (poems!)
  eleventyConfig.amendLibrary("md", (md) => md.set({ breaks: true, html: true, typographer: false }));

  eleventyConfig.addCollection("issues", (api) =>
    api.getFilteredByTag("issue").sort((a, b) => b.data.number - a.data.number));
  eleventyConfig.addCollection("pieces", (api) =>
    api.getFilteredByTag("piece").sort((a, b) => (b.data.issue || 0) - (a.data.issue || 0) || (a.data.order || 99) - (b.data.order || 99)));

  eleventyConfig.addCollection("sections", (api) =>
    api.getFilteredByTag("section").sort((a, b) => (a.data.order || 99) - (b.data.order || 99)));
  eleventyConfig.addFilter("sectionsOfTab", (sections, cat) => sections.filter((x) => x.data.tab === cat.name || cat.kinds.includes(x.data.tab)));
  eleventyConfig.addFilter("inMenu", (sections) => sections.filter((x) => x.data.show_in_menu !== false));
  eleventyConfig.addFilter("ofSection", (pieces, name) => pieces.filter((p) => p.data.section && p.data.section === name));
  eleventyConfig.addFilter("noSectionIn", (pieces, sections) => pieces.filter((p) => !p.data.section || !sections.some((x) => x.data.name === p.data.section)));
  eleventyConfig.addFilter("sectionByName", (sections, name) => sections.find((x) => x.data.name === name));
  eleventyConfig.addFilter("issueItem", (issues, n) => issues.find((i) => +i.data.number === +n) || issues[0]);
  eleventyConfig.addFilter("ofIssue", (pieces, n) => pieces.filter((p) => +p.data.issue === +n));
  eleventyConfig.addFilter("ofCat", (pieces, key) => pieces.filter((p) => kindToCat(p.data.kind).key === key));
  eleventyConfig.addFilter("mainWorks", (pieces) => pieces.filter((p) => ["poems", "stories"].includes(kindToCat(p.data.kind).key)));
  eleventyConfig.addFilter("moreWorks", (pieces) => pieces.filter((p) => !["poems", "stories"].includes(kindToCat(p.data.kind).key)));
  eleventyConfig.addFilter("catOf", (kind) => kindToCat(kind));
  eleventyConfig.addFilter("withImage", (pieces) => pieces.filter((p) => p.data.image));
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("md", (s) => mdLib.render(s || ""));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("excludeNum", (issues, n) => issues.filter((i) => +i.data.number !== +n));
  eleventyConfig.addFilter("firstLetter", (s) => (s || "").trim().charAt(0));
  eleventyConfig.addFilter("neighbors", (pieces, url) => {
    const i = pieces.findIndex((p) => p.url === url);
    const n = pieces.length;
    return n < 2 ? null : { prev: pieces[(i + n - 1) % n], next: pieces[(i + 1) % n] };
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
