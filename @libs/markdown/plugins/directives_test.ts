import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

Deno.test("`Plugin.directives` renders custom directive blocks", () => {
  const markdown = new Renderer({ directives: true })
  expect(markdown.render(":::foo\nbaz\n:::")).toBe(`<div class="foo">\n<p>baz</p>\n</div>`)
})

Deno.test("`Plugin.directives` parses directive attributes", () => {
  const markdown = new Renderer({ directives: true })
  expect(markdown.render(`:::foo{#bar .qux quux="corge"}\nbaz\n:::`)).toBe(`<div id="bar" class="foo qux" quux="corge">\n<p>baz</p>\n</div>`)
})

Deno.test("`Plugin.directives` exposes a way to create custom formatting", () => {
  const markdown = new Renderer({ directives: { render: (name, attributes) => ({ tag: "section", attributes: { ...attributes, "data-directive": name } }) } })
  expect(markdown.render(":::foo{bar=qux}\nbaz\n:::")).toBe(`<section bar="qux" data-directive="foo">\n<p>baz</p>\n</section>`)
})
