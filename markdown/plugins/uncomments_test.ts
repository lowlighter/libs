import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./uncomments.ts"

Deno.test("`Plugin.uncomments` renders without any comments", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("foo<!-- baz -->bar")).resolves.toMatch(/foobar/)
})
