import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ ruby: true })

Deno.test("`Plugin.ruby` renders ruby content", () => {
  expect(markdown.render("{foo}^(bar)")).toMatch(/<ruby>foo<rp>\(<\/rp><rt>bar<\/rt><rp>\)<\/rp><\/ruby>/)
})
