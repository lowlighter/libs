import { expect, type testing } from "@libs/testing"
import { basename, build, dirname, exists, join } from "./build.ts"

const root = join(import.meta.dirname!, "fixtures", "build")
const permissions = { read: true, write: true } as const

/** Creates a console-like logger that captures its messages. */
function logger() {
  const calls = { debug: [] as string[], info: [] as string[], error: [] as string[] }
  return {
    calls,
    debug: (...args: unknown[]) => void calls.debug.push(args.join(" ")),
    info: (...args: unknown[]) => void calls.info.push(args.join(" ")),
    error: (...args: unknown[]) => void calls.error.push(args.join(" ")),
  }
}

Deno.test("`build()` writes raw string content", { permissions }, async () => {
  const output = join(root, "content-string")
  await build([{ output, files: [{ name: "hello.txt", content: "hello" }] }], { log: logger() })
  expect(await Deno.readTextFile(join(output, "hello.txt"))).toBe("hello")
})

Deno.test("`build()` writes raw binary content", { permissions }, async () => {
  const output = join(root, "content-bytes")
  const bytes = new Uint8Array([1, 2, 3])
  await build([{ output, files: [{ name: "data.bin", content: bytes }] }], { log: logger() })
  expect(await Deno.readFile(join(output, "data.bin"))).toEqual(bytes)
})

Deno.test("`build()` creates nested directories from the file name", { permissions }, async () => {
  const output = join(root, "nested")
  await build([{ output, files: [{ name: "a/b/c.txt", content: "x" }] }], { log: logger() })
  expect(await exists(join(output, "a/b/c.txt"))).toBe(true)
})

Deno.test("`build()` copies a file", { permissions }, async () => {
  const output = join(root, "copy")
  await Deno.mkdir(output, { recursive: true })
  const source = join(output, "source.txt")
  await Deno.writeTextFile(source, "copied")
  await build([{ output, files: [{ name: "dest.txt", copy: source }] }], { log: logger() })
  expect(await Deno.readTextFile(join(output, "dest.txt"))).toBe("copied")
})

Deno.test("`build()` fetches content", { permissions }, async () => {
  const output = join(root, "fetch")
  await build([{ output, files: [{ name: "fetched.txt", fetch: "data:text/plain,fetched" }] }], { log: logger() })
  expect(await Deno.readTextFile(join(output, "fetched.txt"))).toBe("fetched")
})

Deno.test("`build()` calls a callback returning a string", { permissions }, async () => {
  const output = join(root, "call-string")
  await build([{ output, files: [{ name: "called.txt", call: () => Promise.resolve("called") }] }], { log: logger() })
  expect(await Deno.readTextFile(join(output, "called.txt"))).toBe("called")
})

Deno.test("`build()` calls a callback returning binary content", { permissions }, async () => {
  const output = join(root, "call-bytes")
  const bytes = new Uint8Array([9, 9])
  await build([{ output, files: [{ name: "called.bin", call: () => Promise.resolve(bytes) }] }], { log: logger() })
  expect(await Deno.readFile(join(output, "called.bin"))).toEqual(bytes)
})

Deno.test("`build()` empties the output directory when requested", { permissions }, async () => {
  const output = join(root, "empty")
  await Deno.mkdir(output, { recursive: true })
  await Deno.writeTextFile(join(output, "stale.txt"), "stale")
  await build([{ output, empty: true, files: [{ name: "fresh.txt", content: "fresh" }] }], { log: logger() })
  expect(await exists(join(output, "stale.txt"))).toBe(false)
  expect(await exists(join(output, "fresh.txt"))).toBe(true)
})

Deno.test("`build()` keeps existing files when `empty` is not set", { permissions }, async () => {
  const output = join(root, "no-empty")
  await Deno.mkdir(output, { recursive: true })
  await Deno.writeTextFile(join(output, "keep.txt"), "keep")
  await build([{ output, files: [{ name: "add.txt", content: "add" }] }], { log: logger() })
  expect(await exists(join(output, "keep.txt"))).toBe(true)
  expect(await exists(join(output, "add.txt"))).toBe(true)
})

Deno.test("`build()` reports progress through the provided logger", { permissions }, async () => {
  const output = join(root, "logging")
  const log = logger()
  await build([{ output, files: [{ name: "x.txt", content: "x" }] }], { log })
  expect(log.calls.debug.length).toBeGreaterThan(0)
  expect(log.calls.info.some((line) => line.includes("wrote"))).toBe(true)
})

Deno.test("`build()` does not throw when logging is disabled", { permissions }, async () => {
  const output = join(root, "no-log")
  await build([{ output, files: [{ name: "x.txt", content: "x" }] }], { log: null })
  expect(await exists(join(output, "x.txt"))).toBe(true)
})

Deno.test("`build()` defaults logging to the console", { permissions }, async () => {
  const output = join(root, "default-log")
  await build([{ output, files: [{ name: "x.txt", content: "x" }] }])
  expect(await exists(join(output, "x.txt"))).toBe(true)
})

Deno.test("`build()` bundles an entrypoint, honoring platform and minify defaults and overrides", { permissions }, async () => {
  const output = join(root, "bundle-success")
  const original = (Deno as testing).bundle
  let captured = {} as testing
  ;(Deno as testing).bundle = (options: testing) => {
    captured = options
    return Promise.resolve({ success: true, outputFiles: [{ text: () => "BUNDLED" }], errors: [] })
  }
  try {
    const log = logger()
    await build([{ output, files: [{ name: "out.js", bundle: "entry.ts" }] }], { log })
    expect(await Deno.readTextFile(join(output, "out.js"))).toBe("BUNDLED")
    expect(captured).toMatchObject({ entrypoints: ["entry.ts"], platform: "browser", minify: true, write: false })
    expect(log.calls.info.some((line) => line.includes("bundled"))).toBe(true)
    await build([{ output, files: [{ name: "out.js", bundle: "entry.ts", platform: "deno", minify: false }] }], { log })
    expect(captured).toMatchObject({ platform: "deno", minify: false })
  } finally {
    ;(Deno as testing).bundle = original
  }
})

Deno.test("`build()` skips writing when bundling fails", { permissions }, async () => {
  const output = join(root, "bundle-failure")
  const original = (Deno as testing).bundle
  ;(Deno as testing).bundle = () => Promise.resolve({ success: false, outputFiles: [], errors: [{ text: "boom" }] })
  try {
    const log = logger()
    await build([{ output, files: [{ name: "out.js", bundle: "bad.ts" }] }], { log })
    expect(await exists(join(output, "out.js"))).toBe(false)
    expect(log.calls.error.some((line) => line.includes("boom"))).toBe(true)
    expect(log.calls.error.some((line) => line.includes("bundling failed"))).toBe(true)
  } finally {
    ;(Deno as testing).bundle = original
  }
})

Deno.test("`build()` skips writing when bundling produces no output", { permissions }, async () => {
  const output = join(root, "bundle-empty")
  const original = (Deno as testing).bundle
  ;(Deno as testing).bundle = () => Promise.resolve({ success: true, outputFiles: [], errors: [] })
  try {
    const log = logger()
    await build([{ output, files: [{ name: "out.js", bundle: "entry.ts" }] }], { log })
    expect(await exists(join(output, "out.js"))).toBe(false)
    expect(log.calls.error.some((line) => line.includes("no output"))).toBe(true)
  } finally {
    ;(Deno as testing).bundle = original
  }
})

Deno.test("`bundle` re-exports `@std` path and filesystem helpers", { permissions }, async () => {
  expect(join("a", "b")).toBe("a/b")
  expect(basename("/a/b.txt")).toBe("b.txt")
  expect(dirname("/a/b.txt")).toBe("/a")
  expect(await exists(import.meta.filename!)).toBe(true)
})
