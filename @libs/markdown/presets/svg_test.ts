import { expect } from "@libs/testing"
import { markdown } from "./svg.ts"

Deno.test("`Presets.svg` renders markdown with raw html escaped", () => {
  expect(markdown("# foo")).toBe("<h1>foo</h1>")
  expect(markdown("<script>alert('foo')</script>")).not.toContain("<script>")
  expect(markdown("```ts\nconst foo = 'bar'\n```")).toContain(`class="hljs language-ts"`)
})
