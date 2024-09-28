import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin, { directive, h } from "./directives.ts"

test("deno")("`Plugin.directives` renders custom directive blocks", async () => {
  const custom = directive((node) => {
    node.data ??= {}
    node.data.hName = "div"
    node.data.hProperties = h(node.data.hName, { bar: "qux" }).properties
  })
  const markdown = new Renderer({ plugins: [plugin, custom] })
  await expect(markdown.render(":::foo\nbaz\n:::")).resolves.toMatch(/<div bar="qux"><p>baz<\/p><\/div>/)
})
