import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ callouts: true })

Deno.test("`Plugin.callouts` renders obsidian-style callouts", () => {
  expect(markdown.render("> [!note]\n> foo")).toBe(`<blockquote class="callout" data-callout="note">\n<p>foo</p>\n</blockquote>`)
})

Deno.test("`Plugin.callouts` leaves regular blockquotes untouched", () => {
  expect(markdown.render("> foo")).toBe("<blockquote>\n<p>foo</p>\n</blockquote>")
})
