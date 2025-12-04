// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, inspect, test } from "@libs/testing"
import { markdown } from "./default.ts"

for (
  const { text, mode, render } of [
    { text: "**foo**", mode: "default", render: "<p><strong>foo</strong></p>" },
  ]
) {
  test(`\`markdown(${inspect(text)}, ${inspect({ mode })})\` returns ${inspect(render)}`, async () => {
    const rendered = await markdown(text)
    expect(rendered).toBe(render)
  })
}
