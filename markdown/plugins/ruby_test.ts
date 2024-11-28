import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./ruby.ts"

test("`Plugin.ruby` renders ruby content", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("{foo}^(bar)")).resolves.toMatch(/<ruby>foo<rp>\(<\/rp><rt>bar<\/rt><rp>\)<\/rp><\/ruby>/)
})
