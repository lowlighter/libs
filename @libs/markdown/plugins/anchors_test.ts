import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ anchors: true })

Deno.test("`Plugin.anchors` renders headers with anchored links", () => {
  expect(markdown.render("# foo")).toBe(`<h1 id="foo"><a href="#foo">foo</a></h1>`)
})

Deno.test("`Plugin.anchors` deduplicates slugs", () => {
  expect(markdown.render("# foo\n\n# foo")).toContain(`<h1 id="foo-1"><a href="#foo-1">foo</a></h1>`)
})
