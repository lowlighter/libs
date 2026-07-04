import { expect } from "@libs/testing"
import { manifest, rescope, unmap, workspaceImports } from "./_utils.ts"

Deno.test("`rescope()` rewrites the scope of import specifiers", () => {
  expect(rescope('import { command } from "@libs/run/command"', { from: "@libs", to: "@lowlighter" })).toBe('import { command } from "@lowlighter/run/command"')
  expect(rescope('import { command } from "@libs/run/command"', { from: "@libs", to: "" })).toBe('import { command } from "run/command"')
  expect(rescope('import { command } from "@libs/run/command"', { from: "@libs", to: "@libs" })).toBe('import { command } from "@libs/run/command"')
})

Deno.test("`unmap()` resolves imports against an import map", () => {
  const imports = {
    "@std/fmt": "jsr:@std/fmt@^1.0.10",
    "@libs/run/": "jsr:@libs/run@^3.0.0/",
    "@libs/run/command/": "jsr:@libs/run@^3.0.0/command/",
    "highlight.js/": "npm:/highlight.js@^11.11.1/",
  }
  // Exact and prefix matches
  expect(unmap('import { colors } from "@std/fmt"', imports)).toEqual({ result: 'import { colors } from "jsr:@std/fmt@^1.0.10"', resolved: 1 })
  expect(unmap('import { command } from "@libs/run/command"', imports)).toEqual({ result: 'import { command } from "jsr:@libs/run@^3.0.0/command"', resolved: 1 })
  expect(unmap('import hljs from "highlight.js/lib/core"', imports)).toEqual({ result: 'import hljs from "npm:/highlight.js@^11.11.1/lib/core"', resolved: 1 })
  // Longest prefix wins
  expect(unmap('import { command } from "@libs/run/command/extra"', imports)).toEqual({ result: 'import { command } from "jsr:@libs/run@^3.0.0/command/extra"', resolved: 1 })
  // Type imports, side-effects imports, re-exports and multiline imports
  expect(unmap('import type { Result } from "@libs/run/command"', imports).resolved).toBe(1)
  expect(unmap('import "@std/fmt"', imports).resolved).toBe(1)
  expect(unmap('export * from "@std/fmt"', imports).resolved).toBe(1)
  expect(unmap('import {\n  command,\n} from "@libs/run/command"', imports).resolved).toBe(1)
  // Unmapped imports are left untouched
  expect(unmap('import { unrelated } from "./unrelated.ts"', imports)).toEqual({ result: 'import { unrelated } from "./unrelated.ts"', resolved: 0 })
  expect(unmap('const string = "@std/fmt"', imports).resolved).toBe(0)
})

Deno.test("`workspaceImports()` maps workspace members to their jsr.io counterparts", async () => {
  const path = await Deno.makeTempDir()
  try {
    await Deno.mkdir(`${path}/pkg`)
    await Deno.mkdir(`${path}/@scope/member`, { recursive: true })
    await Deno.mkdir(`${path}/unnamed`)
    await Deno.mkdir(`${path}/unversioned`)
    await Deno.writeTextFile(`${path}/deno.jsonc`, JSON.stringify({ workspace: ["pkg", "@scope/*", "unnamed", "unversioned"] }))
    await Deno.writeTextFile(`${path}/pkg/deno.jsonc`, JSON.stringify({ name: "@libs/pkg", version: "1.0.0" }))
    await Deno.writeTextFile(`${path}/@scope/member/deno.json`, JSON.stringify({ name: "@libs/member", version: "2.0.0" }))
    await Deno.writeTextFile(`${path}/unnamed/deno.jsonc`, JSON.stringify({}))
    await Deno.writeTextFile(`${path}/unversioned/deno.jsonc`, JSON.stringify({ name: "@libs/unversioned" }))
    // The workspace root is discovered from any nested directory
    expect(await workspaceImports(`${path}/pkg`)).toEqual({
      "@libs/pkg": "jsr:@libs/pkg@^1.0.0",
      "@libs/pkg/": "jsr:@libs/pkg@^1.0.0/",
      "@libs/member": "jsr:@libs/member@^2.0.0",
      "@libs/member/": "jsr:@libs/member@^2.0.0/",
    })
  } finally {
    await Deno.remove(path, { recursive: true })
  }
})

Deno.test("`workspaceImports()` returns an empty map when no workspace root is found", async () => {
  const path = await Deno.makeTempDir()
  try {
    expect(await workspaceImports(path)).toEqual({})
  } finally {
    await Deno.remove(path, { recursive: true })
  }
})

Deno.test("`manifest()` returns null when no manifest is present", async () => {
  const path = await Deno.makeTempDir()
  try {
    expect(manifest(path)).toBeNull()
  } finally {
    await Deno.remove(path, { recursive: true })
  }
})

Deno.test("`manifest()` rethrows errors other than NotFound", async () => {
  const path = await Deno.makeTempDir()
  try {
    await Deno.mkdir(`${path}/deno.jsonc`)
    expect(() => manifest(path)).toThrow()
  } finally {
    await Deno.remove(path, { recursive: true })
  }
})
