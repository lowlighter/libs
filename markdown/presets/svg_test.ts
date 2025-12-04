// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, inspect, test } from "@libs/testing"
import { markdown } from "./default.ts"

for (
  const { text, mode, render } of [
    { text: "**foo**", mode: "svg", render: "<p><strong>foo</strong></p>" },
    { text: "```ts\nconst foo = true\n```", mode: "svg", render: /class="hljs language-ts"/ },
    { text: "foo <script>1 + 1</script> bar", mode: "svg", render: "<p>foo  bar</p>" },
  ]
) {
  test(`\`markdown(${inspect(text)}, ${inspect({ mode })})\` ${render instanceof RegExp ? "matches" : "returns"} ${inspect(render)}`, async () => {
    const rendered = await markdown(text)
    if (render instanceof RegExp) {
      expect(rendered).toMatch(render)
    } else {
      expect(rendered).toBe(render)
    }
  })
}
