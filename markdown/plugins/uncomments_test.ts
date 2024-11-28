import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./uncomments.ts"

test("`Plugin.uncomments` renders without any comments", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("foo<!-- baz -->bar")).resolves.toMatch(/foobar/)
})
