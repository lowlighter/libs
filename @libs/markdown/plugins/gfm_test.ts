import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer()

Deno.test("`Plugin.gfm` renders strikethrough", () => {
  expect(markdown.render("~~foo~~")).toMatch(/<s>foo<\/s>/)
})

Deno.test("`Plugin.gfm` renders autolinks", () => {
  expect(markdown.render("https://example.test")).toMatch(/<a href="https:\/\/example.test">https:\/\/example.test<\/a>/)
})

Deno.test("`Plugin.gfm` renders footnotes", () => {
  expect(markdown.render("[^foo]\n\n[^foo]: bar")).toContain(`<section class="footnotes">`)
})

Deno.test("`Plugin.gfm` renders tasklists", () => {
  expect(markdown.render("- [ ] foo")).toMatch(/<li class="task-list-item"><input type="checkbox" disabled> foo<\/li>/)
  expect(markdown.render("- [x] foo")).toMatch(/<li class="task-list-item"><input type="checkbox" disabled checked> foo<\/li>/)
  expect(markdown.render("- [ ] foo")).toMatch(/<ul class="contains-task-list">/)
})

Deno.test("`Plugin.gfm` renders tables", () => {
  expect(markdown.render("| foo |\n|-|\n| bar |")).toMatch(/<table>[\s\S]*<\/table>/)
})
