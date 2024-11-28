import { expect, test } from "@libs/testing"
import { Renderer } from "./renderer.ts"
import pluginGfm from "./plugins/gfm.ts"

test("`Renderer.render()` renders markdown", async () => {
  const markdown = new Renderer()
  await expect(markdown.render("# foo")).resolves.toBe("<h1>foo</h1>")
  await expect(Renderer.render("# foo")).resolves.toBe("<h1>foo</h1>")
})

test("`Renderer.with()` instantiates a new customized renderer", async () => {
  const markdown = await Renderer.with({ plugins: ["./plugins/gfm.ts", new URL("./plugins/gfm.ts", import.meta.url), pluginGfm] })
  await expect(markdown.render("# foo")).resolves.toBe("<h1>foo</h1>")
})

test("`Renderer.with()` honors throw option when creating a new customized renderer", async () => {
  await expect(Renderer.with({ plugins: ["unknown"], throw: false })).resolves.toBeInstanceOf(Renderer)
  await expect(Renderer.with({ plugins: ["unknown"], throw: true })).rejects.toThrow(ReferenceError)
})
