import { expect } from "@libs/testing"
import { markdown, Renderer } from "./mod.ts"

Deno.test("`markdown()` renders markdown", () => {
  expect(markdown("# foo")).toBe("<h1>foo</h1>")
})

Deno.test("`markdown()` escapes raw html unless the `html` option is enabled", () => {
  expect(markdown("<b>foo</b>")).toBe("<p>&lt;b&gt;foo&lt;/b&gt;</p>")
  expect(markdown("<script>alert('foo')</script>")).not.toContain("<script>")
  expect(markdown("<b>foo</b>", { html: true })).toBe("<p><b>foo</b></p>")
})

Deno.test("`markdown()` supports toggling features", () => {
  expect(markdown("==foo==")).toBe("<p>==foo==</p>")
  expect(markdown("==foo==", { markers: true })).toBe("<p><mark>foo</mark></p>")
})

Deno.test("`markdown()` returns metadata when asked", () => {
  expect(markdown("---\ntitle: foo\n---\nbar", { frontmatter: true, metadata: true })).toEqual({ value: "<p>bar</p>", metadata: { frontmatter: { title: "foo" } } })
})

Deno.test("`markdown()` reuses cached renderers for serializable options", () => {
  expect(markdown("# foo", { markers: true })).toBe(markdown("# foo", { markers: true }))
  expect(markdown("[[foo]]", { wikilinks: { resolve: (link) => `/wiki/${link}` } })).toContain(`href="/wiki/foo"`)
})

Deno.test("`markdown()` exposes the `Renderer` class", () => {
  expect(new Renderer()).toBeInstanceOf(Renderer)
})
