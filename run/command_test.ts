import { command } from "./command.ts"
import { expect } from "@std/expect"

/** Alias for `any` that can be used for testing. */
// deno-lint-ignore no-explicit-any
type testing = any

Deno.test("`command()` can spawn subprocesses asynchronously", { permissions: { run: ["deno"] } }, async () => {
  let result = command("deno", ["--version"], { env: { NO_COLOR: "true" } }) as testing
  expect(result).toBeInstanceOf(Promise)
  result = await result
  expect(result).toMatchObject({ success: true, code: 0, stdin: "", stderr: "" })
  expect(result.stdio).toBeInstanceOf(Array)
  expect(result.stdout).toMatch(/deno/)
})

Deno.test("`command()` can spawn subprocesses asynchronously in background", { permissions: { run: ["deno"] } }, async () => {
  const process = command("deno", ["repl"], { env: { NO_COLOR: "true" }, background: true })
  expect(process).toHaveProperty("pid")
  await process.kill()
  process.unref()
  await expect(process.result).resolves.toMatchObject({ success: false, stdin: "", stderr: "" })
})

Deno.test("`command()` can spawn subprocesses synchronously", { permissions: { run: ["deno"] } }, () => {
  const result = command("deno", ["--version"], { env: { NO_COLOR: "true" }, sync: true })
  expect(result).not.toBeInstanceOf(Promise)
  expect(result).toMatchObject({ success: true, code: 0, stdin: "", stderr: "" })
  expect(result.stdio).toBeInstanceOf(Array)
  expect(result.stdout).toMatch(/deno/)
})

Deno.test("`command()` writes to stdin and closes it through the callback generator", { permissions: { run: ["deno"] } }, async () => {
  const result = await command("deno", ["repl"], {
    stdin: "piped",
    env: { NO_COLOR: "true" },
    callback: async function* ({ stdio }) {
      for await (const { stdout } of stdio) {
        if (!stdout.includes("exit using")) {
          continue
        }
        yield "console.log('hello')\n"
        return
      }
    },
  })
  expect(result).toMatchObject({ success: true, code: 0, stdin: "console.log('hello')\n" })
  expect(result.stdout).toMatch(/hello/)
})

Deno.test("`command()` writes to stdin multiple times through the callback generator", { permissions: { run: ["deno"] } }, async () => {
  const result = await command("deno", ["repl"], {
    stdin: "piped",
    env: { NO_COLOR: "true" },
    callback: async function* ({ stdio }) {
      for await (const { stdout } of stdio) {
        if (!stdout.includes("exit using")) {
          continue
        }
        yield "const a = 1\n"
        yield "console.log(a + 1)\n"
        return
      }
    },
  })
  expect(result).toMatchObject({ success: true, code: 0, stdin: "const a = 1\nconsole.log(a + 1)\n" })
  expect(result.stdout).toMatch(/2/)
})

Deno.test("`command()` closes stdin when the callback generator returns without writing", { permissions: { run: ["deno"] } }, async () => {
  const result = await command("deno", ["repl"], {
    env: { NO_COLOR: "true" },
    callback: async function* () {},
  })
  expect(result).toMatchObject({ success: true, code: 0 })
})

Deno.test("`command()` supports awaiting inside the callback generator", { permissions: { run: ["deno"] } }, async () => {
  let waited = false
  const result = await command("deno", ["repl"], {
    env: { NO_COLOR: "true" },
    // deno-lint-ignore require-yield
    callback: async function* () {
      await new Promise((resolve) => setTimeout(resolve, 250))
      waited = true
    },
  })
  expect(waited).toBe(true)
  expect(result).toMatchObject({ success: true, code: 0 })
})

Deno.test("`command()` kills the process and rejects when the callback generator throws", { permissions: { run: ["deno"] } }, async () => {
  await expect(command("deno", ["repl"], {
    env: { NO_COLOR: "true" },
    // deno-lint-ignore require-yield
    callback: async function* () {
      throw new TypeError("boom")
    },
  })).rejects.toThrow(TypeError)
})

for (const sync of [false, true]) {
  for (const mode of ["inherit", "piped", null] as const) {
    Deno.test(`\`command()\` supports stdio set to \`"${mode}"\` in ${sync ? "sync" : "async"} mode`, { permissions: { run: ["deno"] } }, async () => {
      const result = await command("deno", ["eval", "null"], {
        env: { NO_COLOR: "true" },
        stdin: mode,
        stdout: mode,
        stderr: mode,
        sync: sync as testing,
      })
      expect(result).toMatchObject({ success: true, code: 0 })
    })
  }
}

Deno.test("`command()` handles both stdout and stderr channels", { permissions: { run: ["deno"] } }, async () => {
  const result = await command("deno", ["eval", "await Deno.stdout.write(new TextEncoder().encode(`foo\n`));await Deno.stderr.write(new TextEncoder().encode(`bar\n`))"], {
    env: { NO_COLOR: "true" },
    stdout: "piped",
    stderr: "piped",
  })
  expect(result).toMatchObject({ success: true, code: 0, stdout: "foo", stderr: "bar" })
})

Deno.test("`command()` supports buffering", { permissions: { run: ["deno"] } }, async () => {
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
})

Deno.test("`command()` throws an error when throw option is enabled and exit code is non-zero", { permissions: { run: ["deno"] } }, async () => {
  expect(() => command("deno", ["eval", "Deno.exit(1)"], { env: { NO_COLOR: "true" }, throw: true, sync: true })).toThrow(EvalError)
  await expect(command("deno", ["eval", "Deno.exit(1)"], { env: { NO_COLOR: "true" }, throw: true })).rejects.toThrow(EvalError)
})

Deno.test("`command()` does nothing in dryrun", { permissions: { run: ["deno"] } }, async () => {
  expect(command("deno", ["--version"], { dryrun: true, sync: true })).toMatchObject({ success: true, code: 0, stdio: [], stdin: "", stderr: "", stdout: "" })
  await expect(command("deno", ["--version"], { dryrun: true })).resolves.toMatchObject({ success: true, code: 0, stdio: [], stdin: "", stderr: "", stdout: "" })
})

Deno.test("`command()` appends windows extension when os platform is windows", { permissions: { run: ["deno"] } }, () => {
  expect(command("", ["--version"], { sync: true, winext: "deno", os: "windows" })).toMatchObject({ success: true, code: 0 })
})
