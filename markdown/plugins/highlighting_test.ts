import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./highlighting.ts"

test("`Plugin.highlighting` renders syntax highlighted code blocks", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("```ts\nconst foo = 'bar'\n```")).resolves.toMatch(/<pre><code class=".*language-ts">[\s\S]+<\/code><\/pre>/)
})
