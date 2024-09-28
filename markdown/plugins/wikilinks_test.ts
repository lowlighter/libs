import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin, { create } from "./wikilinks.ts"

test("deno")("`Plugin.wikilinks` renders wiki links format", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("[[Foo Bar]]")).resolves.toMatch(/<a class=".*wikilink.*" href="\/pages\/foo-bar">Foo Bar<\/a>/)
})

test("deno")("`Plugin.wikilinks` exposes a way to create custom formatting", async () => {
  const markdown = new Renderer({ plugins: [create({ existing: ["foo"] })] })
  await expect(markdown.render("[[foo]]")).resolves.toMatch(/<a class="wikilink".*>foo<\/a>/)
  await expect(markdown.render("[[bar]]")).resolves.toMatch(/<a class="wikilink new".*>bar<\/a>/)
})
