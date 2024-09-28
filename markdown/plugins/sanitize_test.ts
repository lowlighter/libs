import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin, { create, schema } from "./sanitize.ts"

test("deno")("`Plugin.sanitize` renders sanitized output", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("foo <script>console.log('hello')</script> bar")).not.resolves.toContain("<script>")
})

test("deno")("`Plugin.sanitize` exposes a way to create custom sanitization", async () => {
  const a = new Renderer({ plugins: [create({ ...schema, attributes: { span: [] } })] })
  await expect(a.render("<span foo></span>")).resolves.not.toContain("foo")
  const b = new Renderer({ plugins: [create({ ...schema, attributes: { span: ["foo"] } })] })
  await expect(b.render("<span foo></span>")).resolves.toContain("foo")
})
