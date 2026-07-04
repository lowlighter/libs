import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ mermaid: true })

Deno.test("`Plugin.mermaid` renders mermaid diagrams for client-side processing", () => {
  expect(markdown.render("```mermaid\ngraph TD;\nA-->B;\n```")).toBe(`<pre class="mermaid">graph TD;\nA--&gt;B;</pre>`)
})

Deno.test("`Plugin.mermaid` leaves other code blocks untouched", () => {
  expect(markdown.render("```ts\nconst foo = 'bar'\n```")).toMatch(/<pre><code class="language-ts">/)
})
