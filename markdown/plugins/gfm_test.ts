import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./gfm.ts"

Deno.test("`Plugin.gfm` renders strikethrough", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("~~foo~~")).resolves.toMatch(/<del>foo<\/del>/)
})

Deno.test("`Plugin.gfm` renders autolinks", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("https://example.test")).resolves.toMatch(/<a href="https:\/\/example.test">https:\/\/example.test<\/a>/)
})

Deno.test("`Plugin.gfm` renders footnotes", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("[^foo]\n\n[^foo]:bar")).resolves.toContain("Footnotes")
})

Deno.test("`Plugin.gfm` renders tasklists", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("- [ ] foo")).resolves.toMatch(/<li class="task-list-item">.*<\/li>/)
})

Deno.test("`Plugin.gfm` renders tasklists", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("| foo |\n|-|\n| bar |")).resolves.toMatch(/<table>.*<\/table>/)
})
