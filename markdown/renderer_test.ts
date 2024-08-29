import { expect, test } from "@libs/testing"
import { Renderer } from "./renderer.ts"

test("all")("Renderer.render() renders markdown", async () => {
  const markdown = new Renderer()
  await expect(markdown.render("# foo")).resolves.toBe("<h1>foo</h1>")
  await expect(Renderer.render("# foo")).resolves.toBe("<h1>foo</h1>")
})
