import { expect } from "@libs/testing"
import * as icons from "./icons.ts"

for (const [name, icon] of Object.entries(icons)) {
  Deno.test(`\`${name}()\` renders an svg element`, () => {
    expect(icon()).toMatch(/<svg.*<\/svg>/s)
  })
}
