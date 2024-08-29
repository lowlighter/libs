import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./linebreaks.ts"

test("all")("Plugin.linebreaks renders hard linebreaks", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("foo\nbar")).resolves.toMatch(/foo<br>\nbar/)
})
