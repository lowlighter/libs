import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

Deno.test("`Plugin.wikilinks` renders wiki links format", () => {
  const markdown = new Renderer({ wikilinks: true })
  expect(markdown.render("[[Foo Bar]]")).toMatch(/<a class="wikilink" href="\/pages\/foo-bar">Foo Bar<\/a>/)
  expect(markdown.render("[[foo|label]]")).toMatch(/<a class="wikilink" href="\/pages\/foo">label<\/a>/)
})

Deno.test("`Plugin.wikilinks` supports custom formatting", () => {
  const markdown = new Renderer({ wikilinks: { existing: ["foo"], resolve: (link) => `/wiki/${link}` } })
  expect(markdown.render("[[foo]]")).toMatch(/<a class="wikilink" href="\/wiki\/foo">foo<\/a>/)
  expect(markdown.render("[[bar]]")).toMatch(/<a class="wikilink new" href="\/wiki\/bar">bar<\/a>/)
})
