import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./anchors.ts"

test("deno")("Plugin.anchors renders headers with anchored links", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("# foo")).resolves.toMatch(/<h1 id="foo"><a.*href="#foo">foo<\/a><\/h1>/)
})
