import { expect, test } from "@libs/testing"
import { Renderer } from "./renderer.ts"
import pluginGfm from "./plugins/gfm.ts"

test("all")("Renderer.render() renders markdown", async () => {
  const markdown = new Renderer()
  await expect(markdown.render("# foo")).resolves.toBe("<h1>foo</h1>")
  await expect(Renderer.render("# foo")).resolves.toBe("<h1>foo</h1>")
})

test("all")("Renderer.with() instantiates a new customized renderer", async () => {
  const markdown = await Renderer.with({ plugins: ["./plugins/gfm.ts", new URL("./plugins/gfm.ts", import.meta.url), pluginGfm] })
  await expect(markdown.render("# foo")).resolves.toBe("<h1>foo</h1>")
})
