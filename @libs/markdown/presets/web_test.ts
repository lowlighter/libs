import { expect } from "@libs/testing"
import { markdown } from "./web.ts"

Deno.test("`Presets.web` renders markdown including untrusted html", () => {
  expect(markdown("# foo")).toBe("<h1>foo</h1>")
  expect(markdown("<b>foo</b>")).toBe("<p><b>foo</b></p>")
  expect(markdown("```ts\nconst foo = 'bar'\n```")).toContain(`class="hljs language-ts"`)
})
