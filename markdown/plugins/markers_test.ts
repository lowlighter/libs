import { expect, test } from "@libs/testing"
import { Renderer } from "../renderer.ts"
import plugin from "./markers.ts"

test("all")("Plugin.markers renders markers", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("==foo==")).resolves.toMatch(/<mark class="">foo<\/mark>/)
})

test("all")("Plugin.markers renders colored markers", async () => {
  const markdown = new Renderer({ plugins: [plugin] })
  await expect(markdown.render("=r=foo==")).resolves.toMatch(/<mark class="" r="">foo<\/mark>/)
})
