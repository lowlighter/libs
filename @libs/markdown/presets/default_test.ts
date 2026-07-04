import { expect } from "@libs/testing"
import { markdown } from "./default.ts"

Deno.test("`Presets.default` renders markdown", () => {
  expect(markdown("# foo")).toBe("<h1>foo</h1>")
  expect(markdown("<b>foo</b>")).toBe("<p>&lt;b&gt;foo&lt;/b&gt;</p>")
})
