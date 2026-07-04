// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { markdown } from "./default.ts"

for (
  const { text, render } of [
    { text: "**foo**", mode: "default", render: "<p><strong>foo</strong></p>" },
  ]
) {
  Deno.test(`\`markdown(${inspect(text)})\` returns ${inspect(render)}`, async () => {
    const rendered = await markdown(text)
    expect(rendered).toBe(render)
  })
}
