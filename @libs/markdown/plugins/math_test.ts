import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ math: true })

Deno.test("`Plugin.math` renders display math expressions", () => {
  expect(markdown.render("$$\\pi$$")).toBe(`<div class="math math-display">\\pi</div>`)
  expect(markdown.render("$$\nx = 1\n$$")).toBe(`<div class="math math-display">x = 1</div>`)
})

Deno.test("`Plugin.math` renders inline math expressions", () => {
  expect(markdown.render("foo $x^2$ bar")).toBe(`<p>foo <span class="math math-inline">x^2</span> bar</p>`)
})

Deno.test("`Plugin.math` ignores non-math dollar signs", () => {
  expect(markdown.render("$5 and $10")).toBe("<p>$5 and $10</p>")
})
