import { expect } from "@libs/testing"
import * as plugins from "./mod.ts"

Deno.test("`Plugins` are all exported", () => {
  for (const plugin of Object.values(plugins))
    expect(plugin).toBeInstanceOf(Function)
})
