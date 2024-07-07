import { Logger, type loglevel } from "./mod.ts"
import { stripAnsiCode } from "@std/fmt/colors"
import { basename } from "@std/path/basename"
import { expect, fn, test, type testing } from "@libs/testing"

function args(f: ReturnType<typeof fn>, { call = 0 } = {}) {
  return (f as testing)[Symbol.for("@MOCK")]?.calls[call]?.args
}

function json(f: ReturnType<typeof fn>, { call = 0 } = {}) {
  return JSON.parse(args(f, { call })?.[0] || "null")
}

function text(f: ReturnType<typeof fn>, { call = 0 } = {}) {
  const [header, ...content] = (args(f, { call }) ?? [""]).map(stripAnsiCode) as string[]
  return {
    header: header.replaceAll(/%c/g, "").trim(),
    content: content.slice(header.match(/%c/g)?.length ?? 0),
  }
}

const levels = Object.keys(Logger.level).filter((level) => level !== "disabled") as loglevel[]

for (const level of levels) {
  test("all")(`Logger.${level}() outputs content`, () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: Logger.level.debug, format: Logger.format.json })
    log[level]("foo")
    expect(output[level]).toBeCalledTimes(1)
    expect(json(output[level])).toMatchObject({ level, content: ["foo"] })
    for (const other of levels.filter((other) => other !== level)) {
      expect(output[other]).not.toBeCalled()
    }
  })
}

test("all")(`Logger.constructor() accepts number and string for loglevel`, () => {
  expect(new Logger({ output: null, level: Logger.level.error }).level).toBe(Logger.level.error)
  expect(new Logger({ output: null, level: "error" }).level).toBe(Logger.level.error)
  expect(new Logger({ output: null, level: 0 }).level).toBe(Logger.level.error)
  expect(new Logger({ output: null, level: "unknown" as testing }).level).toBe(Logger.level.log)
})

test("all")("Logger.with() creates a new Logger with additional tags", () => {
  const log = new Logger()
  expect(log.with({ foo: true }).tags).toEqual({ foo: true })
  expect(log.with({ foo: true }).with({ bar: true }).tags).toEqual({ foo: true, bar: true })
})

test("all")("Logger.format.text() formats output", () => {
  const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
  const log = new Logger({ output, level: Logger.level.log, format: Logger.format.text, tags: { tag: true } })
  log.log("foo")
  expect(text(output.log, { call: 0 }).header).toContain("tag:true")
  expect(text(output.log, { call: 0 }).content).toEqual(['"foo"'])
  Object.assign(log.options, { caller: { file: true, name: true, line: true } })
  function test() {
    log.log("bar")
  }
  test()
  expect(text(output.log, { call: 1 }).header).toContain(import.meta.url)
  expect(text(output.log, { call: 1 }).header).toMatch(new RegExp(`${test.name}:\\d+:\\d+`))
  expect(text(output.log, { call: 1 }).content).toEqual(['"bar"'])
  Object.assign(log.options, { caller: { file: true, fileformat: /.*\/(?<file>.*)$/ } })
  log.log("baz")
  expect(text(output.log, { call: 2 }).header).not.toContain(import.meta.url)
  expect(text(output.log, { call: 2 }).header).toContain(basename(import.meta.url))
  expect(text(output.log, { call: 2 }).content).toEqual(['"baz"'])
  Object.assign(log.options, { caller: false })
  log.log("qux")
  expect(text(output.log, { call: 3 }).header).not.toContain(basename(import.meta.url))
  expect(text(output.log, { call: 3 }).content).toEqual(['"qux"'])
  Object.assign(log.options, { date: true, time: true })
  log.log("quux")
  expect(text(output.log, { call: 4 }).header).toMatch(/ \d{4,}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z /)
  expect(text(output.log, { call: 4 }).content).toEqual(['"quux"'])
  Object.assign(log.options, { date: true, time: false })
  log.log("corge")
  expect(text(output.log, { call: 5 }).header).toMatch(/ \d{4,}-\d{2}-\d{2} /)
  expect(text(output.log, { call: 5 }).content).toEqual(['"corge"'])
  Object.assign(log.options, { date: false, time: true })
  log.log("grault")
  expect(text(output.log, { call: 6 }).header).toMatch(/ \d{2}:\d{2}:\d{2}\.\d{3} /)
  expect(text(output.log, { call: 6 }).content).toEqual(['"grault"'])
  Object.assign(log.options, { date: false, time: false, delta: true })
  log.log("garply")
  expect(text(output.log, { call: 7 }).header).toMatch(/ \+[.\d]+ /)
  expect(text(output.log, { call: 7 }).content).toEqual(['"garply"'])
})

test("all")("Logger.format.json() formats output", () => {
  const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
  const log = new Logger({ output, level: Logger.level.log, format: Logger.format.json, tags: { tag: true } })
  log.log("foo")
  expect(json(output.log, { call: 0 })).toMatchObject({ tags: { tag: true } })
  expect(json(output.log, { call: 0 })).toMatchObject({ content: ["foo"] })
  expect(json(output.log, { call: 0 })).toMatchObject({ level: "log" })
  expect(json(output.log, { call: 0 })).toHaveProperty("timestamp")
  Object.assign(log.options, { caller: { file: true, name: true, line: true } })
  function test() {
    log.log("bar")
  }
  test()
  expect(json(output.log, { call: 1 })).toMatchObject({ caller: { file: import.meta.url, name: test.name } })
  expect(json(output.log, { call: 1 })).toMatchObject({ content: ["bar"] })
  Object.assign(log.options, { caller: { file: true, fileformat: /.*\/(?<file>.*)$/ } })
  log.log("baz")
  expect(json(output.log, { call: 2 })).toMatchObject({ caller: { file: basename(import.meta.url) } })
  expect(json(output.log, { call: 2 })).toMatchObject({ content: ["baz"] })
  Object.assign(log.options, { caller: false })
  log.log("qux")
  expect(json(output.log, { call: 3 })).not.toHaveProperty("caller")
  expect(json(output.log, { call: 3 })).toMatchObject({ content: ["qux"] })
  Object.assign(log.options, { date: true, time: true })
  log.log("quux")
  expect(json(output.log, { call: 4 })).toHaveProperty("date")
  expect(json(output.log, { call: 4 })).toHaveProperty("time")
  expect(json(output.log, { call: 4 })).toMatchObject({ content: ["quux"] })
  Object.assign(log.options, { date: true, time: false })
  log.log("corge")
  expect(json(output.log, { call: 5 })).toHaveProperty("date")
  expect(json(output.log, { call: 5 })).toMatchObject({ content: ["corge"] })
  Object.assign(log.options, { date: false, time: true })
  log.log("grault")
  expect(json(output.log, { call: 6 })).toHaveProperty("time")
  expect(json(output.log, { call: 6 })).toMatchObject({ content: ["grault"] })
  Object.assign(log.options, { date: false, time: false, delta: true })
  log.log("garply")
  expect(json(output.log, { call: 7 })).toHaveProperty("delta")
  expect(json(output.log, { call: 7 })).toMatchObject({ content: ["garply"] })
})

test("deno")("Logger.level defaults to LOG_LEVEL environment variable", () => {
  const _ = Deno.env.get("LOG_LEVEL")
  try {
    expect(new Logger({ output: null }).level).toBe(Logger.level.log)
    Deno.env.set("LOG_LEVEL", `${Logger.level.error}`)
    expect(new Logger({ output: null }).level).toBe(Logger.level.error)
    Deno.env.set("LOG_LEVEL", "warn")
    expect(new Logger({ output: null }).level).toBe(Logger.level.warn)
    Deno.env.set("LOG_LEVEL", "invalid")
    expect(new Logger({ output: null }).level).toBe(Logger.level.log)
    Deno.env.set("LOG_LEVEL", "debug")
    expect(new Logger({ output: null, level: Logger.level.info }).level).toBe(Logger.level.info)
  } finally {
    switch (typeof _) {
      case "string":
        Deno.env.set("LOG_LEVEL", _)
        break
      default:
        Deno.env.delete("LOG_LEVEL")
    }
  }
}, { permissions: { env: ["LOG_LEVEL"] } })

test("deno")("Logger supports non-deno runtimes", () => {
  const { Deno: _ } = globalThis
  try {
    delete (globalThis as testing).Deno
    expect(() => new Logger({ output: null }).log("foo")).not.toThrow()
    expect(() => Logger.inspect({ foo: "bar" })).not.toThrow()
  } finally {
    Object.assign(globalThis, { Deno: _ })
  }
})

test("deno")("Logger.format.text() formats delta value smartly", () => {
  const _ = performance.now
  try {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: Logger.level.log, options: { delta: true } })
    for (const [i, dt] of Object.entries(["+0.0015", "+1.500"])) {
      Object.assign(performance, {
        now() {
          return Number(dt) * 1000
        },
      })
      log.log("foo")
      expect(text(output.log, { call: Number(i) }).header).toContain(dt)
    }
  } finally {
    Object.assign(performance, { now: _ })
  }
})
