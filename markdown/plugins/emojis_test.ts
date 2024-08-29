import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./emojis.ts"

test("all")("Plugin.emojis renders emojis", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render(":bento:")).resolves.toMatch(/🍱/)
})
