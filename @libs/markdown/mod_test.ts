import { expect } from "@libs/testing"
import { markdown, Renderer } from "./mod.ts"

Deno.test("`markdown()` renders markdown", () => {
  expect(markdown("# foo")).toBe("<h1>foo</h1>")
})

Deno.test("`markdown()` escapes raw html unless the `html` option is enabled", () => {
  expect(markdown("<b>foo</b>")).toBe("&lt;b&gt;foo&lt;/b&gt;")
  expect(markdown("<script>alert('foo')</script>")).not.toContain("<script>")
  expect(markdown("<b>foo</b>", { html: true })).toBe("<b>foo</b>")
})

Deno.test("`markdown()` supports toggling features", () => {
  expect(markdown("==foo==")).toBe("==foo==")
  expect(markdown("==foo==", { markers: true })).toBe("<mark>foo</mark>")
})

Deno.test("`markdown()` unwraps lone paragraphs inline by default and keeps the wrapper when inline is disabled", () => {
  expect(markdown("hello **world**")).toBe("hello <strong>world</strong>")
  expect(markdown("hello **world**", { inline: false })).toBe("<p>hello <strong>world</strong></p>")
  expect(markdown("a\n\nb")).toBe("<p>a</p>\n<p>b</p>")
})

Deno.test("`markdown()` returns metadata when asked", () => {
  expect(markdown("---\ntitle: foo\n---\nbar", { frontmatter: true, metadata: true })).toEqual({ value: "bar", metadata: { frontmatter: { title: "foo" } } })
})

Deno.test("`markdown()` reuses cached renderers for serializable options", () => {
  expect(markdown("# foo", { markers: true })).toBe(markdown("# foo", { markers: true }))
  expect(markdown("[[foo]]", { wikilinks: { resolve: (link) => `/wiki/${link}` } })).toContain(`href="/wiki/foo"`)
})

Deno.test("`markdown()` exposes the `Renderer` class", () => {
  expect(new Renderer()).toBeInstanceOf(Renderer)
})
