// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, inspect, test } from "@libs/testing"
import { markdown } from "./text.ts"

for (
  const { text, render } of [
    { text: "**foo**", mode: "text", render: "foo" },
    { text: "```ts\nconst foo = true\n```", mode: "text", render: "const foo = true\n" },
    { text: "foo <script>1 + 1</script> bar", mode: "text", render: "foo  bar" },
  ]
) {
  test(`\`markdown(${inspect(text)})\` returns ${inspect(render)}`, async () => {
    const rendered = await markdown(text)
    expect(rendered).toBe(render)
  })
}
