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
  expect(markdown.render("~~foo~~")).toBe("~~foo~~")
  expect(markdown.render("https://example.test")).toBe("https://example.test")
})

Deno.test("`Renderer.render()` honors the `breaks` option", () => {
  const markdown = new Renderer({ breaks: true })
  expect(markdown.render("foo\nbar")).toBe("foo<br>\nbar")
})

Deno.test("`Renderer.render()` unwraps lone paragraphs inline by default and keeps the wrapper when inline is disabled", () => {
  const markdown = new Renderer()
  expect(markdown.render("hello **world**")).toBe("hello <strong>world</strong>")
  expect(markdown.render("hello **world**", { inline: false })).toBe("<p>hello <strong>world</strong></p>")
  expect(markdown.render("a\n\nb")).toBe("<p>a</p>\n<p>b</p>")
  expect(markdown.render("# foo")).toBe("<h1>foo</h1>")
})

Deno.test("`Renderer.render()` returns metadata when asked", () => {
  const markdown = new Renderer({ frontmatter: true })
  expect(markdown.render("---\ntitle: foo\n---\nbar", { metadata: true })).toEqual({ value: "bar", metadata: { frontmatter: { title: "foo" } } })
})

Deno.test("`Renderer` honors the `hooks` option for custom rules", () => {
  const markdown = new Renderer({
    hooks(engine) {
      engine.renderer.rules.code_inline = (tokens, index) => `<kbd>${engine.utils.escapeHtml(tokens[index].content)}</kbd>`
    },
  })
  expect(markdown.render("`foo`")).toBe("<kbd>foo</kbd>")
})
