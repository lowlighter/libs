import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ frontmatter: true })

Deno.test("`Plugin.frontmatter` removes frontmatter and parses it as metadata", () => {
  const { value, metadata } = markdown.render("---\nfoo: bar\n---\n\ncontent", { metadata: true })
  expect(value).toBe("<p>content</p>")
  expect(metadata).toEqual({ frontmatter: { foo: "bar" } })
})

Deno.test("`Plugin.frontmatter` ignores frontmatter after the first line", () => {
  expect(markdown.render("content\n\n---\nfoo: bar\n---", { metadata: true }).metadata).toEqual({})
})
