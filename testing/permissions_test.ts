import { test } from "./_testing.ts"
import { expect } from "./expect.ts"
import { flags } from "./permissions.ts"

test()("`flags` for unrestricted permissions", () => {
  expect(flags(true)).toBe("--allow-all")
  expect(flags("inherit")).toBe("--allow-all")
})

test()("`flags` for no permissions", () => {
  expect(flags(false)).toBe("")
  expect(flags(null)).toBe("")
  expect(flags({})).toBe("")
  expect(flags("none")).toBe("")
})

test()("`flags` for granular permissions", () => {
  expect(flags({ env: true })).toBe("--allow-env")
  expect(flags({ env: "inherit" })).toBe("--allow-env")
  expect(flags({ env: false })).toBe("--deny-env")
  expect(flags({ env: ["FOO", "BAR"] })).toBe("--allow-env=FOO,BAR")
  expect(flags({ env: ["FOO", "BAR"], read: true, write: false })).toBe("--allow-env=FOO,BAR --allow-read --deny-write")
})
