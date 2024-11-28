import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./frontmatter.ts"

test("`Plugin.frontmatter` removes frontmatter", async () => {
  const text = `
---
foo: bar
---

content
`.trim()
  const markdown = new Renderer({ plugins: [plugin] })
  const { value, metadata } = await markdown.render(text, { metadata: true })
  expect(value).not.toContain("---\nfoo: bar\n---")
  expect(value).toMatch(/content/)
  expect(metadata).toEqual({ frontmatter: { foo: "bar" } })
})
