import { Logger, type loglevel } from "./_logger.ts"
import { stripAnsiCode } from "@std/fmt/colors"
import { basename, fromFileUrl } from "@std/path"
import { expect, fn, runtime, test, type testing } from "@libs/testing"

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

function channel(level: string): "error" | "warn" | "info" | "log" | "debug" {
  if (level === "ok") {
    return "info"
  }
  if ((level === "trace") || (level === "wdebug") || (level === "probe")) {
    return "debug"
  }
  if (["error", "warn", "info", "log", "debug"].includes(level)) {
    return level as ReturnType<typeof channel>
  }
  return "log"
}

if (runtime === "deno") {
  test("`Logger.constructor()` instantiates a new Logger defaulting to `LOG_LEVEL`", () => {
    new Logger()
    const _ = Deno.env.get("LOG_LEVEL")
    try {
      Deno.env.set("LOG_LEVEL", `${Logger.level.error}`)
      expect(new Logger().level()).toBe(Logger.level.error)
      Deno.env.set("LOG_LEVEL", "error")
      expect(new Logger().level()).toBe(Logger.level.error)
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
}

test("`Logger.options()` gets logger options", () => {
  const log = new Logger()
  expect(log.options()).not.toBeInstanceOf(Logger)
  expect(log.options()).toHaveProperty("date")
  expect(log.options()).toHaveProperty("time")
  expect(log.options()).toHaveProperty("delta")
  expect(log.options()).toHaveProperty("caller")
  expect(log.options()).toHaveProperty("caller.file")
  expect(log.options()).toHaveProperty("caller.name")
  expect(log.options()).toHaveProperty("caller.line")
  expect(log.options()).toHaveProperty("caller.fileformat")
})

test("`Logger.options()` sets logger options", () => {
  const log = new Logger()
  expect(log.options({})).toBeInstanceOf(Logger)
  expect(log.options({ date: true }).options()).toMatchObject({ date: true })
  expect(log.options({ time: true }).options()).toMatchObject({ time: true })
  expect(log.options({ delta: true }).options()).toMatchObject({ delta: true })
  expect(log.options({ caller: { file: true } }).options()).toMatchObject({ caller: { file: true } })
  expect(log.options({ caller: { name: true } }).options()).toMatchObject({ caller: { name: true } })
  expect(log.options({ caller: { line: true } }).options()).toMatchObject({ caller: { line: true } })
  expect(log.options({ caller: { fileformat: [/foo/, "bar"] } }).options()).toMatchObject({ caller: { fileformat: [/foo/, "bar"] } })
  expect(log.options({ caller: true }).options()).toMatchObject({ caller: { file: true, name: true, line: true, fileformat: [/foo/, "bar"] } })
  expect(log.options({ caller: false }).options()).toMatchObject({ caller: { file: false, name: false, line: false, fileformat: [/foo/, "bar"] } })
})

test("`Logger.level()` gets logger level", () => {
  const log = new Logger()
  expect(log.level()).not.toBeInstanceOf(Logger)
  expect(log.level()).toBeType("number")
})

test("`Logger.level()` sets logger options", () => {
  expect(new Logger().level(0)).toBeInstanceOf(Logger)
  expect(new Logger().level(0).level()).toBe(Logger.level.error)
  expect(new Logger().level(Logger.level.error).level()).toBe(Logger.level.error)
  expect(new Logger().level("0" as testing).level()).toBe(Logger.level.error)
  expect(new Logger().level("error").level()).toBe(Logger.level.error)
  expect(new Logger().level(NaN).level()).toBe(Logger.level.disabled)
  expect(new Logger().level(-1).level()).toBe(Logger.level.disabled)
  expect(new Logger().level(Logger.level.disabled).level()).toBe(Logger.level.disabled)
  expect(new Logger().level("-1" as testing).level()).toBe(Logger.level.disabled)
  expect(new Logger().level("disabled").level()).toBe(Logger.level.disabled)
  expect(new Logger().level(Logger.level.log).level("unknown" as testing).level()).toBe(Logger.level.log)
})

const levels = Object.keys(Logger.level).filter((level) => !["always", "disabled"].includes(level)) as loglevel[]
for (const level of levels) {
  test(`\`Logger.${level}()\` prints content to \`Logger.output\``, () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "always", format: "json" })
    log[level]("foo")
    expect(output[channel(level)]).toBeCalledTimes(1)
    expect(json(output[channel(level)])).toMatchObject({ level, content: ["foo"] })
    for (const other of levels.filter((other) => (other !== "probe") && (channel(other) !== channel(level)))) {
      expect(output[channel(other)]).not.toBeCalled()
    }
  })

  test(`\`Logger.${level}()\` does not print content to \`Logger.output\` when log level is disabled`, () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "disabled", format: "json" })
    for (const level of levels.filter((channel) => (channel !== "probe"))) {
      log[level]("foo")
      expect(output[channel(level)]).not.toBeCalled()
    }
  })
}

test("`Logger.tags` are readonly and typed", () => {
  const log = new Logger({ tags: { foo: true } })
  expect(log.tags).toEqual({ foo: true })
  // @ts-check: tags are correctly typed
  log.tags.foo
  // @ts-expect-error: tags are correctly typed
  log.tags.bar
  // @ts-expect-error: tags are readonly
  log.tags.foo = true
})

test("`Logger.with()` creates a new logger with additional tags", () => {
  const log = new Logger({ tags: { foo: true } }).with({ bar: true })
  expect(log.tags).toEqual({ foo: true, bar: true })
  // @ts-check: tags are correctly typed
  log.tags.foo
  log.tags.bar
  // @ts-expect-error: tags are correctly typed
  log.tags.baz
  // @ts-expect-error: tags are readonly
  log.tags.foo = true
})

if (runtime === "deno") {
  test("`Logger.with()` creates a new logger with inherited censorship", () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "text" }).censor({ keys: ["foo"], values: ["bar"], replace: "****" }).with()
    log.log({ foo: "hello", foobar: "abc bar qux" })
    expect(text(output.log, { call: 0 }).content[0]).toContain('foo: "****"')
    expect(text(output.log, { call: 0 }).content[0]).toContain('foobar: "abc **** qux"')
  })

  test("`Logger.prototype.format.text()` formats output", () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "text", tags: { tag: true } })
    log.log("foo")
    expect(text(output.log, { call: 0 }).header).toContain("tag:true")
    expect(text(output.log, { call: 0 }).content).toEqual(["foo"])
    log.options({ caller: true })
    function test() {
      log.log("bar")
    }
    test()
    expect(text(output.log, { call: 1 }).header).toContain(fromFileUrl(import.meta.url))
    expect(text(output.log, { call: 1 }).header).toMatch(new RegExp(`${test.name}:\\d+:\\d+`))
    expect(text(output.log, { call: 1 }).content).toEqual(["bar"])
    log.options({ caller: { fileformat: [/.*\/(?<file>.*)$/, "$<file>"] } })
    log.log("baz")
    expect(text(output.log, { call: 2 }).header).not.toContain(fromFileUrl(import.meta.url))
    expect(text(output.log, { call: 2 }).header).toContain(basename(fromFileUrl(import.meta.url)))
    expect(text(output.log, { call: 2 }).content).toEqual(["baz"])
    log.options({ caller: false })
    log.log("qux")
    expect(text(output.log, { call: 3 }).header).not.toContain(basename(fromFileUrl(import.meta.url)))
    expect(text(output.log, { call: 3 }).content).toEqual(["qux"])
    log.options({ date: true, time: true })
    log.log("quux")
    expect(text(output.log, { call: 4 }).header).toMatch(/ \d{4,}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z /)
    expect(text(output.log, { call: 4 }).content).toEqual(["quux"])
    log.options({ date: true, time: false })
    log.log("corge")
    expect(text(output.log, { call: 5 }).header).toMatch(/ \d{4,}-\d{2}-\d{2} /)
    expect(text(output.log, { call: 5 }).content).toEqual(["corge"])
    log.options({ date: false, time: true })
    log.log("grault")
    expect(text(output.log, { call: 6 }).header).toMatch(/ \d{2}:\d{2}:\d{2}\.\d{3} /)
    expect(text(output.log, { call: 6 }).content).toEqual(["grault"])
    log.options({ date: false, time: false, delta: true })
    log.log("garply")
    expect(text(output.log, { call: 7 }).header).toMatch(/ \+[.\d]+ /)
    expect(text(output.log, { call: 7 }).content).toEqual(["garply"])
  })

  test("`Logger.prototype.format.text()` formats delta value smartly", () => {
    const _ = performance.now
    try {
      const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
      const log = new Logger({ output, level: "log", delta: true })
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

  test("`Logger.prototype.format.text()` supports censorship", () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "text", tags: { token: "api_foobar" }, censor: {} })
    log
      .censor({ values: [/(api_)\w+/], replace: "$1****" })
      .censor({ keys: ["password", /^secret_/], replace: "****" })
      .log("my key is <api_foobar>", { user: "foo", password: "bar", secret_a: "a", secret_b: "b", friend: "bar", meta: { created: 123, deleted: null, secret_c: "c", api: "<api_foobar>", fn() {} } })
    expect(text(output.log, { call: 0 }).header).toContain("token:api_****")
    expect(text(output.log, { call: 0 }).content[0]).toContain("my key is <api_****>")
    expect(text(output.log, { call: 0 }).content[1]).toContain('user: "foo"')
    expect(text(output.log, { call: 0 }).content[1]).toContain('password: "****"')
    expect(text(output.log, { call: 0 }).content[1]).toContain('secret_a: "****"')
    expect(text(output.log, { call: 0 }).content[1]).toContain('secret_b: "****"')
    expect(text(output.log, { call: 0 }).content[1]).toContain('friend: "bar"')
    expect(text(output.log, { call: 0 }).content[1]).toContain("created: 123")
    expect(text(output.log, { call: 0 }).content[1]).toContain("deleted: null")
    expect(text(output.log, { call: 0 }).content[1]).toContain('secret_c: "****"')
    expect(text(output.log, { call: 0 }).content[1]).toContain('api: "<api_****>"')
    expect(text(output.log, { call: 0 }).content[1]).toContain("fn: [Function: fn]")
    log
      .censor({ values: [/offensive-word/g], replace: "****" })
      .log("foo bar offensive-word baz another offensive-word")
    expect(text(output.log, { call: 1 }).content[0]).toContain("foo bar **** baz another ****")
  })
}

test("Logger.prototype.inspect() supports non-deno platforms", () => {
  const { Deno: _ } = globalThis
  try {
    delete (globalThis as testing).Deno
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "text" })
    log.log({ foo: "bar" })
  } finally {
    Object.assign(globalThis, { Deno: _ })
  }
})

if (runtime === "deno") {
  test("`Logger.prototype.format.json()` formats output", () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "json", tags: { tag: true } })
    log.log("foo")
    expect(json(output.log, { call: 0 })).toMatchObject({ tags: { tag: true } })
    expect(json(output.log, { call: 0 })).toMatchObject({ content: ["foo"] })
    expect(json(output.log, { call: 0 })).toMatchObject({ level: "log" })
    expect(json(output.log, { call: 0 })).toHaveProperty("timestamp")
    log.options({ caller: true })
    function test() {
      log.log("bar")
    }
    test()
    expect(json(output.log, { call: 1 })).toMatchObject({ caller: { file: fromFileUrl(import.meta.url), name: test.name } })
    expect(json(output.log, { call: 1 })).toMatchObject({ content: ["bar"] })
    log.options({ caller: { fileformat: [/.*\/(?<file>.*)$/, "$<file>"] } })
    log.log("baz")
    expect(json(output.log, { call: 2 })).toMatchObject({ caller: { file: basename(fromFileUrl(import.meta.url)) } })
    expect(json(output.log, { call: 2 })).toMatchObject({ content: ["baz"] })
    log.options({ caller: false })
    log.log("qux")
    expect(json(output.log, { call: 3 })).not.toHaveProperty("caller")
    expect(json(output.log, { call: 3 })).toMatchObject({ content: ["qux"] })
    log.options({ date: true, time: true })
    log.log("quux")
    expect(json(output.log, { call: 4 })).toHaveProperty("date")
    expect(json(output.log, { call: 4 })).toHaveProperty("time")
    expect(json(output.log, { call: 4 })).toMatchObject({ content: ["quux"] })
    log.options({ date: true, time: false })
    log.log("corge")
    expect(json(output.log, { call: 5 })).toHaveProperty("date")
    expect(json(output.log, { call: 5 })).toMatchObject({ content: ["corge"] })
    log.options({ date: false, time: true })
    log.log("grault")
    expect(json(output.log, { call: 6 })).toHaveProperty("time")
    expect(json(output.log, { call: 6 })).toMatchObject({ content: ["grault"] })
    log.options({ date: false, time: false, delta: true })
    log.log("garply")
    expect(json(output.log, { call: 7 })).toHaveProperty("delta")
    expect(json(output.log, { call: 7 })).toMatchObject({ content: ["garply"] })
  })

  test("`Logger.prototype.format.json()` supports censorship", () => {
    const output = { log: fn(), debug: fn(), info: fn(), warn: fn(), error: fn() }
    const log = new Logger({ output, level: "log", format: "json", tags: { token: "api_foobar" } })
    log
      .censor({ values: [/(api_)\w+/], replace: "$1****" })
      .censor({ keys: ["password", /^secret_/], replace: "****" })
      .log("my key is <api_foobar>", { user: "foo", password: "bar", secret_a: "a", secret_b: "b", friend: "bar", meta: { created: 123, deleted: null, secret_c: "c", api: "<api_foobar>", fn() {} } })
    expect(json(output.log, { call: 0 })).toMatchObject({ tags: { token: "api_****" } })
    expect(json(output.log, { call: 0 })).toMatchObject({
      content: ["my key is <api_****>", {
        user: "foo",
        password: "****",
        secret_a: "****",
        secret_b: "****",
        friend: "bar",
        meta: { created: 123, deleted: null, secret_c: "****", api: "<api_****>" },
      }],
    })
  })
}
