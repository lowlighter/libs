import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./math.ts"

Deno.test("`Plugin.math` renders math expressions", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("$$\\pi$$")).resolves.toMatch(/mjx-container class="MathJax"/)
})
