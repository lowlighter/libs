import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./mermaid.ts"

test("all")("Plugin.mermaid renders mermaid diagrams", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("```mermaid\ngraph TD;\nA-->A;\n```")).resolves.toMatch(/foo<br>\nbar/)
}, { permissions: { read: true, env: true, sys: "inherit", write: "inherit", run: "inherit" } })
