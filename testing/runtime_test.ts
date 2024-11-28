import { test } from "./test.ts"
import { expect } from "./expect.ts"
import { runtime } from "./runtime.ts"

test("`runtime` is set", () => expect(runtime).toBeOneOf(["deno", "bun", "node"]))
