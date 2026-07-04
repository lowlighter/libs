import { expect } from "@libs/testing"
import { Renderer } from "./renderer.ts"

Deno.test("`Renderer.render()` renders markdown", () => {
  const markdown = new Renderer()
  expect(markdown.render("# foo")).toBe("<h1>foo</h1>")
})

Deno.test("`Renderer.render()` renders github flavored markdown by default", () => {
  const markdown = new Renderer()
  expect(markdown.render("~~foo~~")).toContain("<s>foo</s>")
  expect(markdown.render("| foo |\n|-|\n| bar |")).toContain("<table>")
  expect(markdown.render("https://example.test")).toContain(`<a href="https://example.test">https://example.test</a>`)
})

Deno.test("`Renderer.render()` honors the `gfm` option", () => {
  const markdown = new Renderer({ gfm: false })
  expect(markdown.render("~~foo~~")).toBe("<p>~~foo~~</p>")
  expect(markdown.render("https://example.test")).toBe("<p>https://example.test</p>")
})

Deno.test("`Renderer.render()` honors the `breaks` option", () => {
  const markdown = new Renderer({ breaks: true })
  expect(markdown.render("foo\nbar")).toBe("<p>foo<br>\nbar</p>")
})

Deno.test("`Renderer.render()` returns metadata when asked", () => {
  const markdown = new Renderer({ frontmatter: true })
  expect(markdown.render("---\ntitle: foo\n---\nbar", { metadata: true })).toEqual({ value: "<p>bar</p>", metadata: { frontmatter: { title: "foo" } } })
})

Deno.test("`Renderer` honors the `hooks` option for custom rules", () => {
  const markdown = new Renderer({
    hooks(engine) {
      engine.renderer.rules.code_inline = (tokens, index) => `<kbd>${engine.utils.escapeHtml(tokens[index].content)}</kbd>`
    },
  })
  expect(markdown.render("`foo`")).toBe("<p><kbd>foo</kbd></p>")
})
