import { expect } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./mermaid.ts"

Deno.test.ignore("`Plugin.mermaid` renders mermaid diagrams", { permissions: { read: true, env: true, sys: true, write: "inherit", run: "inherit" } }, async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("```mermaid\ngraph TD;\nA-->A;\n```")).resolves.toMatch(/foo<br>\nbar/)
})
