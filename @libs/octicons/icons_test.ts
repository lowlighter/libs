// Imports
import { expect } from "@libs/testing"
import octicons from "@primer/octicons"
import * as icons from "./icons.ts"

Deno.test("every upstream icon has an exported wrapper", () => {
  const names = Object.keys(octicons).map((name) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()))
  expect(Object.keys(icons).sort()).toEqual(names.sort())
})

for (const [name, icon] of Object.entries(icons)) {
  Deno.test(`\`${name}()\` renders an svg element`, () => {
    expect(icon()).toMatch(/<svg.*<\/svg>/s)
  })
}
