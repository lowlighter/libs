import { expect } from "@libs/testing"
import { markdown } from "./text.ts"

Deno.test("`Presets.text` renders markdown as plain text", () => {
  expect(markdown("# foo")).toBe("foo")
  expect(markdown("*foo* <b>bar</b>")).toBe("foo bar")
  expect(markdown("<script>alert('foo')</script>bar")).toBe("bar")
})
