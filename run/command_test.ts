import { Logger } from "@libs/logger"
import { command } from "./command.ts"
import { expect, test, type testing } from "@libs/testing"

test("deno")("command() can spawn subprocesses asynchronously", async () => {
  let result = command("deno", ["--version"], { env: { NO_COLOR: "true" } }) as testing
  expect(result).toBeInstanceOf(Promise)
  result = await result
  expect(result).toMatchObject({ success: true, code: 0, stdin: "", stderr: "" })
  expect(result.stdio).toBeInstanceOf(Array)
  expect(result.stdout).toMatch(/deno/)
}, { permissions: { run: ["deno"] } })

test("deno")("command() can spawn subprocesses synchronously", () => {
  const result = command("deno", ["--version"], { env: { NO_COLOR: "true" }, sync: true })
  expect(result).not.toBeInstanceOf(Promise)
  expect(result).toMatchObject({ success: true, code: 0, stdin: "", stderr: "" })
  expect(result.stdio).toBeInstanceOf(Array)
  expect(result.stdout).toMatch(/deno/)
}, { permissions: { run: ["deno"] } })

test("deno")("command() handles callback<write()> and callback<close()> calls", async () => {
  const result = await command("deno", ["repl"], { env: { NO_COLOR: "true" }, callback: ({ i, write, close }) => i === 0 ? write("console.log('hello')") : close() })
  expect(result).toMatchObject({ success: true, code: 0, stdin: "console.log('hello')" })
  expect(result.stdout).toMatch(/hello/)
}, { permissions: { run: ["deno"] } })

test("deno")("command() handles multiple callback<close()> calls", async () => {
  const result = await command("deno", ["repl"], {
    env: { NO_COLOR: "true" },
    callback: async ({ close }) => {
      await close()
      await close()
    },
  })
  expect(result).toMatchObject({ success: true, code: 0 })
}, { permissions: { run: ["deno"] } })

test("deno")("command() handles callback<wait()> calls", async () => {
  let waited = false
  const result = await command("deno", ["repl"], {
    env: { NO_COLOR: "true" },
    callback: ({ wait, close }) => waited ? close() : (waited = true, wait(250)),
  })
  expect(result).toMatchObject({ success: true, code: 0 })
}, { permissions: { run: ["deno"] } })

for (const sync of [false, true]) {
  for (const mode of ["inherit", "piped", null, "debug", "log", "info", "warn", "error"] as const) {
    test("deno")(`command() supports stdio set to "${mode}" in "${sync ? "sync" : "async"}" mode`, async () => {
      const result = await command("deno", ["--version"], {
        log: new Logger({ level: Logger.level.disabled }),
        env: { NO_COLOR: "true" },
        stdin: mode,
        stdout: mode,
        stderr: mode,
        sync: sync as testing,
      })
      expect(result).toMatchObject({ success: true, code: 0 })
    }, { permissions: { run: ["deno"] } })
  }
}

test("deno")("command() handles both stdout and stderr channels", async () => {
  const result = await command("deno", ["eval", "await Deno.stdout.write(new TextEncoder().encode(`foo\n`));await Deno.stderr.write(new TextEncoder().encode(`bar\n`))"], {
    env: { NO_COLOR: "true" },
    stdout: "piped",
    stderr: "piped",
  })
  expect(result).toMatchObject({ success: true, code: 0, stdout: "foo", stderr: "bar" })
}, { permissions: { run: ["deno"] } })

test("deno")("command() supports buffering", async () => {
  // Combined entries if buffering is greater than the time between writes
  {
    const result = await command("deno", ["eval", "console.log(`foo`);await new Promise(resolve => setTimeout(resolve, 100));console.log(`bar`)"], {
      env: { NO_COLOR: "true" },
      buffering: 150,
    })
    expect(result.stdio).toHaveLength(1)
    expect(result.stdio[0][2]).toBe("foo\nbar")
    expect(result.stdout).toBe("foo\nbar")
  }
  // Separated entries if buffering is less than the time between writes
  {
    const result = await command("deno", ["eval", "console.log(`foo`);await new Promise(resolve => setTimeout(resolve, 100));console.log(`bar`)"], {
      env: { NO_COLOR: "true" },
      buffering: 50,
    })
    expect(result.stdio).toHaveLength(2)
    expect(result.stdio[0][2]).toBe("foo")
    expect(result.stdio[1][2]).toBe("bar")
    expect(result.stdout).toBe("foo\nbar")
  }
  // Separated entries even if buffering is active but channel was changed in-between
  {
    const result = await command("deno", [
      "eval",
      "await Deno.stdout.write(new TextEncoder().encode(`foo\n`));await Deno.stderr.write(new TextEncoder().encode(`baz\n`));await Deno.stdout.write(new TextEncoder().encode(`bar\n`))",
    ], {
      stdout: "piped",
      stderr: "piped",
      env: { NO_COLOR: "true" },
      buffering: 200,
    })
    expect(result.stdio).toHaveLength(3)
    expect(result.stdio[0][2]).toBe("foo")
    expect(result.stdio[1][2]).toBe("baz")
    expect(result.stdio[2][2]).toBe("bar")
    expect(result.stdout).toBe("foo\nbar")
    expect(result.stderr).toBe("baz")
  }
}, { permissions: { run: ["deno"] } })

test("deno")("command() throws an error when `throw` option is enabled and exit code is non-zero", async () => {
  expect(() => command("deno", ["eval", "Deno.exit(1)"], { env: { NO_COLOR: "true" }, throw: true, sync: true })).toThrow(EvalError)
  await expect(command("deno", ["eval", "Deno.exit(1)"], { env: { NO_COLOR: "true" }, throw: true })).rejects.toThrow(EvalError)
}, { permissions: { run: ["deno"] } })

test("deno")("command() does nothing in dryrun", async () => {
  expect(command("deno", ["--version"], { dryrun: true, sync: true })).toMatchObject({ success: true, code: 0, stdio: [], stdin: "", stderr: "", stdout: "" })
  await expect(command("deno", ["--version"], { dryrun: true })).resolves.toMatchObject({ success: true, code: 0, stdio: [], stdin: "", stderr: "", stdout: "" })
}, { permissions: { run: ["deno"] } })
