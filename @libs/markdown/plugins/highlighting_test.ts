import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"

const markdown = new Renderer({ highlighting: true })

Deno.test("`Plugin.highlighting` renders syntax highlighted code blocks", () => {
  expect(markdown.render("```ts\nconst foo = 'bar'\n```")).toMatch(/<pre><code class="hljs language-ts">[\s\S]+<\/code><\/pre>/)
})

Deno.test("`Plugin.highlighting` falls back to plain code blocks for unknown languages", () => {
  expect(markdown.render("```unknownlanguage\nfoo\n```")).toMatch(/<pre><code class="language-unknownlanguage">foo\n<\/code><\/pre>/)
})
