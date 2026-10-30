// Imports
import { expect } from "@libs/testing"
import octicons from "@primer/octicons"
import * as icons from "./icons.ts"

Deno.test("every upstream icon has an exported wrapper", () => {
  const names = [...Object.keys(octicons), "empty", "icon"].map((name) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()))
  expect(Object.keys(icons).sort()).toEqual(names.sort())
})

for (const [name, icon] of Object.entries(icons)) {
  if (name === "icon")
    continue
  Deno.test(`\`${name}()\` renders an svg element`, () => {
    const render = icon as (options?: unknown) => string
    expect(render()).toMatch(/<svg.*<\/svg>/s)
  })
}

Deno.test("icon resolves names and falls back to empty", () => {
  expect(icons.icon("alert")).toEqual(icons.alert())
  expect(icons.icon("missing", { width: 24 })).toEqual(icons.empty({ width: 24 }))
})
