import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ emojis: true })

Deno.test("`Plugin.emojis` renders emojis", () => {
  expect(markdown.render(":bento:")).toMatch(/🍱/)
})
