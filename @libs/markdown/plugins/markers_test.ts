import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ markers: true })

Deno.test("`Plugin.markers` renders markers", () => {
  expect(markdown.render("==foo==")).toMatch(/<mark>foo<\/mark>/)
})

Deno.test("`Plugin.markers` renders attributed markers", () => {
  expect(markdown.render("=r=foo=")).toMatch(/<mark r="">foo<\/mark>/)
})

Deno.test("`Plugin.markers` ignores unbalanced markers", () => {
  expect(markdown.render("a == b == c")).toBe("<p>a == b == c</p>")
})
