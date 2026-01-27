import { expect, inspect, test } from "@libs/testing"
import { dirname, join, toFileUrl } from "@std/path"
import { cwd } from "./filesystem.ts"
import { resolve } from "./resolve.ts"

for (
  const { a, b, options } of [
    // Filepaths
    { a: "./", b: toFileUrl(join(cwd(), "mod.ts")).href },
    { a: "../", b: toFileUrl(join(dirname(cwd()), "mod.ts")).href },
    { a: "/", b: `file:///mod.ts` },
    { a: "./script.ts", b: toFileUrl(join(cwd(), "script.ts")).href },
    { a: "../script.ts", b: toFileUrl(join(dirname(cwd()), "script.ts")).href },
    { a: "./script.ts", b: "file:///path/to/script.ts", options: { base: "/path/to" } },
    { a: "../script.ts", b: "file:///path/script.ts", options: { base: "/path/to" } },
    { a: "./script.ts", b: import.meta.resolve("./script.ts"), options: { base: import.meta } },
    { a: "../script.ts", b: import.meta.resolve("../script.ts"), options: { base: import.meta } },
    { a: "/script.ts", b: "file:///script.ts" },
    // URLs
    { a: "file://path/to/script.ts", b: "file://path/to/script.ts" },
    { a: "http://example.com", b: "http://example.com/" },
    { a: "https://example.com", b: "https://example.com/" },
    { a: "http://example.com/script.ts", b: "http://example.com/script.ts" },
    { a: "https://example.com/script.ts", b: "https://example.com/script.ts" },
    { a: "wass://path/to/script.wasm", b: "wass://path/to/script.wasm" },
    { a: "data:,", b: "data:," },
    { a: "blob:,", b: "blob:," },
    // Package protocols
    { a: "jsr:@example/test", b: "jsr:@example/test" },
    { a: "npm:@example/test", b: "npm:@example/test" },
    { a: "node:test", b: "node:test" },
  ]
) {
  test(`\`resolve(${inspect(a)}, ${options})\` is ${inspect(b)}`, () => {
    expect(resolve(a, options)).toBe(b)
  })
}
