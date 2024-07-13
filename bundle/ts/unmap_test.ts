import { unmap } from "./unmap.ts"
import { expect, test } from "@libs/testing"
import { Logger } from "@libs/logger"

const logger = new Logger({ level: "disabled" })
const imports = {
  "@mod": "./mod.ts",
  "@dir/": "./dir/",
  "@dir/b/": "./dir/bb/",
}

test("deno")("unmap() handles bare imports", () => {
  expect(unmap(`import "@mod"`, imports, { logger })).toEqual({ result: `import "./mod.ts"`, resolved: 1 })
})

test("deno")("unmap() handles global imports", () => {
  expect(unmap(`import * as foo from "@mod"`, imports, { logger })).toEqual({ result: `import * as foo from "./mod.ts"`, resolved: 1 })
})

test("deno")("unmap() handles default imports", () => {
  expect(unmap(`import foo from "@mod"`, imports, { logger })).toEqual({ result: `import foo from "./mod.ts"`, resolved: 1 })
  expect(unmap(`import type foo from "@mod"`, imports, { logger })).toEqual({ result: `import type foo from "./mod.ts"`, resolved: 1 })
})

test("deno")("unmap() handles destructured imports", () => {
  expect(unmap(`import { foo, bar as qux, type baz } from "@mod"`, imports, { logger })).toEqual({ result: `import { foo, bar as qux, type baz } from "./mod.ts"`, resolved: 1 })
  expect(unmap(`import type { foo, bar as qux } from "@mod"`, imports, { logger })).toEqual({ result: `import type { foo, bar as qux } from "./mod.ts"`, resolved: 1 })
})

test("deno")("unmap() handles multiline imports", () => {
  expect(unmap(
    `import {
    foo,
    bar as qux,
    type baz,
  } from "@mod"`,
    imports,
    { logger },
  )).toEqual({
    result: `import {
    foo,
    bar as qux,
    type baz,
  } from "./mod.ts"`,
    resolved: 1,
  })
  expect(unmap(
    `import type {
    foo,
    bar as qux,
    type baz,
  } from "@mod"`,
    imports,
    { logger },
  )).toEqual({
    result: `import type {
    foo,
    bar as qux,
    type baz,
  } from "./mod.ts"`,
    resolved: 1,
  })
})

test("deno")("unmap() handles directory imports", () => {
  expect(unmap(`import "@dir"`, imports, { logger })).toEqual({ result: `import "@dir"`, resolved: 0 })
  expect(unmap(`import "@dir/a.ts"`, imports, { logger })).toEqual({ result: `import "./dir/a.ts"`, resolved: 1 })
  expect(unmap(`import "@dir/b/c.ts"`, imports, { logger })).toEqual({ result: `import "./dir/bb/c.ts"`, resolved: 1 })
})

test("deno")("unmap() does not remap unmapped paths", () => {
  expect(unmap(`import "./mod.ts"`, imports, { logger })).toEqual({ result: `import "./mod.ts"`, resolved: 0 })
  expect(unmap(`import "/mod.ts"`, imports, { logger })).toEqual({ result: `import "/mod.ts"`, resolved: 0 })
  expect(unmap(`import "https://example.com/mod.ts"`, imports, { logger })).toEqual({ result: `import "https://example.com/mod.ts"`, resolved: 0 })
  expect(unmap(`import "jsr:@mod/mod"`, imports, { logger })).toEqual({ result: `import "jsr:@mod/mod"`, resolved: 0 })
  expect(unmap(`import "npm:mod"`, imports, { logger })).toEqual({ result: `import "npm:mod"`, resolved: 0 })
})
