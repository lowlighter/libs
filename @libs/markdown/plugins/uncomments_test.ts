import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

Deno.test("`Plugin.uncomments` renders without any comments", () => {
  expect(new Renderer({ uncomments: true }).render("foo<!-- baz -->bar")).toMatch(/foobar/)
  expect(new Renderer({ uncomments: true, html: true }).render("foo<!-- baz -->bar")).toMatch(/foobar/)
})

Deno.test("`Plugin.uncomments` leaves code blocks untouched", () => {
  expect(new Renderer({ uncomments: true }).render("```html\n<!-- foo -->\n```")).toContain("&lt;!-- foo --&gt;")
})
