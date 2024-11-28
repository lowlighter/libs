// Imports
import type { Arg, Nullable, Promisable } from "@libs/typing"
import { Logger, type loglevel } from "@libs/logger"
import { TextLineStream } from "@std/streams"
import { debounce } from "@std/async/debounce"
import { delay } from "@std/async/delay"
export type { Logger, loglevel, Promisable }

/** Run options. */
export type options = {
  /** Logger instance. */
  logger?: Logger
  /** Environment variables. */
  env?: Deno.CommandOptions["env"]
  /** Current working directory. */
  cwd?: Deno.CommandOptions["cwd"]
  /** Raw arguments (Windows only). */
  raw?: boolean
  /** Handling of stdin. When using a loglevel, channel will be piped and logged to specified log level. */
  stdin?: loglevel | "piped" | "inherit" | null
  /** Handling of stdout. When using a loglevel, channel will be piped and logged to specified log level. */
  stdout?: loglevel | "piped" | "inherit" | null
  /** Handling of stderr. When using a loglevel, channel will be piped and logged to specified log level. */
  stderr?: loglevel | "piped" | "inherit" | null
  /**
   * Stdin interaction callback.
   * Each time data is received on either stdin or stdout, this will be called after input buffering.
   * You can then read stdio content, write to stdin, close stdin or retry later (for polling).
   * Passing this option will automatically set stdin to "piped" if it is "inherit" or "null".
   */
  callback?: callback
  /**
   * Stdio buffering.
   * This is used to merge messages that are received relatively closely.
   * Buffering is skipped when a different channel is used in-between.
   */
  buffering?: number
  /**
   * Execute process synchronously.
   * Note that stdin is not usable in sync mode.
   */
  sync?: boolean
  /** Process extension on Windows. */
  winext?: string
  /** Operating system. */
  os?: typeof Deno.build.os
  /** Throw an error if exit code is non-zero rather than returning a result. */
  throw?: boolean
  /**
   * Do not actually execute the command.
   * In this case you will instead receive an empty successful result object.
   */
  dryrun?: boolean
}

/** Run result. */
export type result = {
  /** Whether the process exited with a zero-code. */
  success: Deno.CommandStatus["success"]
  /** Process exit code. */
  code: Deno.CommandStatus["code"]
  /**
   * Process stdio content.
   * First element is the delta timestamp since process start, second element is the channel (0:stdin, 1:stdout, 2:stderr), third element is the content.
   */
  stdio: Array<[number, 0 | 1 | 2, string]>
  /** Process stdin content. */
  stdin: string
  /** Process stdout content. */
  stdout: string
  /** Process stderr content. */
  stderr: string
}

/** Stdin interaction callback. */
export type callback = (options: { stdio: Pick<result, "stdin" | "stdout" | "stderr">; i: number; write: (content: string) => Promise<void>; close: () => Promise<void>; wait: (dt: number) => Promise<void> }) => Promisable<void>

/** Text encoder */
const encoder = new TextEncoder()

/** Text decoder */
const decoder = new TextDecoder()

/**
 * Asynchronous version of {@link command}.
 *
 * Note that stdin is not usable in sync mode and will always be empty.
 *
 * ```ts
 * import { command } from "./command.ts"
 * command("deno", ["--version"], { sync: true })
 * ```
 * ```
 * import { command } from "./command.ts"
 * try {
 *   command("deno", ["eval", "Deno.exit(1)"], { sync: true, throw: true })
 * }
 * catch (error) {
 *   console.log(error)
 * }
 * ```
 */
export function command(bin: string, args: string[], options?: options & { sync?: false }): Promise<result>
/**
 * Synchronous version of {@link command}.
 *
 * ```
 * import { command } from "./command.ts"
 * try {
 *   await command("deno", ["eval", "Deno.exit(1)"], { throw: true })
 * }
 * catch (error) {
 *   console.log(error)
 * }
 * ```
 */
export function command(bin: string, args: string[], options?: options & { sync: true }): result
/**
 * Run a command.
 *
 * This is a wrapper around {@link https://docs.deno.com/api/deno/~/Deno.Command | Deno.command} that provides a better handling of stdio for interactive processes.
 *
 * Like `Deno.command`, the `env`, `cwd`, and `raw` (alias for `windowsRawArguments`) options are supported.
 *
 * The `stdin`, `stdout` and `stderr` options can be either set to an allowed {@link https://docs.deno.com/api/deno/~/Deno.Command | Deno.command} values (`"inherit"`, `"null"`, `"piped"`), or either to a supported log level of {@link Logger}.
 * In the later case, the content will be always be "piped" and logged to the specified level of the provided {@link Logger} instance.
 *
 * Set `winext` option to automatically append an extension to the binary path on Windows (like `.cmd` or `.exe`).
 * This is useful when the binary path isn't automatically resolved on Windows.
 *
 * Pass a `callback` option to interact with the process stdin and stdout.
 * It is called each time data is received on of the piped channels, after input buffering.
 * It will receive an object with the current stdio content, the current command index (based on the content written to stdin), along with a few additional functions:
 * - `write(content: string, newline?: boolean): Promise<void>` encodes and writes content to stdin.
 *   - A newline is automatically appended by default but can be toggled off by passing `false` as second argument.
 * - `close(): Promise<void>` closes stdin.
 *   - Note that you **need** to eventually call this method to prevent most processes from hanging as they're waiting for more input.
 * - `wait(dt: number): Promise<void>` waits for a given amount of time before calling the callback again.
 *   - It is especially useful for polling, like checking if a specific line has been written to stdio or not.
 *
 * The `buffering` option is used to merge messages that are received relatively closely.
 * Setting this option to a low value will also increase the rate at which the `callback` is called.
 *
 * Resulting object contains the same properties as {@link https://docs.deno.com/api/deno/~/Deno.CommandStatus | Deno.CommandStatus}
 * with an additional `stdio` property that contains an array of ordered tuples with the delta timestamp since process start, the channel idenfitier (0:stdin, 1:stdout, 2:stderr) and the content.
 * This offers a proper history of exchanged content.
 *
 * ```ts
 * import { command } from "./command.ts"
 * import { Logger } from "jsr:@libs/logger"
 * await command("deno", ["--version"], { env: { NO_COLOR: "true" }, cwd: "/tmp", raw: true })
 * await command("deno", ["--version"], { stdout: "piped" })
 * await command("deno", ["--version"], { logger: new Logger(), stdout: "debug" })
 * await command("deno", ["--version"], { winext: ".exe" })
 * ```
 *
 * ```ts
 * import { command } from "./command.ts"
 *
 * const { stdout } = await command("deno", ["repl"], {
 *   env: { NO_COLOR: "true" },
 *   // Passing a callback will automatically set `stdin` to `"piped"`
 *   // You can then write to the process using utility functions
 *   callback: async ({ i, stdio, write, close, wait }) => {
 *     if ((!stdio.stdout.includes("exit using")) || (i))
 *       return
 *     await write("console.log('hello')")
 *     await wait(1000)
 *     close()
 *   },
 * })
 * console.assert(stdout.includes("hello"))
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 * @module
 */
export function command(bin: string, args: string[], { logger: log = new Logger(), stdin = null, stdout = "debug", stderr = "error", env, cwd, raw, callback, buffering, sync, throw: _throw, dryrun, winext = "", os = Deno.build.os } = {} as options): Promisable<result> {
  if (os === "windows") {
    bin = `${bin}${winext}`
  }
  log = log.with({ bin })
  if (callback && (handle(stdin) !== "piped")) {
    stdin = "piped"
  }
  const command = new Deno.Command(bin, { args, stdin: !sync ? handle(stdin) : "null", stdout: handle(stdout), stderr: handle(stderr), env, cwd, windowsRawArguments: raw })
  if (dryrun) {
    log.wdebug(`dryrun: ${bin} not executed`)
    const result = { success: true, code: 0, stdio: [], stdin: "", stdout: "", stderr: "" }
    return sync ? result : Promise.resolve(result)
  }
  if (sync) {
    return exec(command, { bin, log, throw: _throw, stdout, stderr })
  }
  return spawn(command, { bin, log, callback, buffering, throw: _throw, stdin: handle(stdin) === "piped" ? stdin as loglevel : null, stdout: handle(stdout) === "piped" ? stdout as loglevel : null, stderr: handle(stderr) === "piped" ? stderr as loglevel : null })
}

/** Returns the handle type for a given mode. */
function handle(mode: Nullable<string>) {
  return ["inherit", "null"].includes(`${mode}`) ? `${mode}` as "inherit" | "null" : "piped"
}

/** Execute a command synchronously. */
function exec(command: Deno.Command, { bin, log, throw: _throw, stdout, stderr }: { bin: string; log: Logger; throw?: boolean; stdout: Nullable<string>; stderr: Nullable<string> }) {
  const start = Date.now()
  const output = command.outputSync()
  const { success, code } = output // Do not access stdout or stderr before "piped" status check
  const t = Date.now() - start
  const stdio = {
    get stdio() {
      return [[t, 1, this.stdout], [t, 2, this.stderr]]
    },
    stdin: "",
    stdout: handle(stdout) === "piped" ? decoder.decode(output.stdout) : "",
    stderr: handle(stderr) === "piped" ? decoder.decode(output.stderr) : "",
  } as Pick<result, "stdio" | "stdin" | "stdout" | "stderr">
  for (const { channel, mode } of [{ channel: "stdout", mode: stdout }, { channel: "stderr", mode: stderr }] as const) {
    if ((handle(mode) === "piped") && (stdio[channel])) {
      log.with({ t, channel })[mode as loglevel]?.(stdio[channel])
    }
  }
  if ((!success) && _throw) {
    throw new EvalError(`${bin} exited with non-zero code ${code}:\n${stdio.stdout}\n${stdio.stderr}`)
  }
  return { success, code, ...stdio }
}

/** Spawn a command asynchronously. */
async function spawn(
  command: Deno.Command,
  { bin, log, callback = ({ close }) => close?.(), buffering = 250, throw: _throw, ...channels }: { bin: string; log: Logger; callback?: callback; buffering?: number; throw?: boolean; stdin: Nullable<loglevel>; stdout: Nullable<loglevel>; stderr: Nullable<loglevel> },
) {
  const process = command.spawn()
  const start = Date.now()
  const stdio = {
    stdio: [],
    get stdin() {
      return this.stdio.filter(([_, i]) => i === 0).map(([_, __, content]) => content).join("\n")
    },
    get stdout() {
      return this.stdio.filter(([_, i]) => i === 1).map(([_, __, content]) => content).join("\n")
    },
    get stderr() {
      return this.stdio.filter(([_, i]) => i === 2).map(([_, __, content]) => content).join("\n")
    },
  } as Pick<result, "stdio" | "stdin" | "stdout" | "stderr">
  const options = {} as Pick<Arg<callback>, "write" | "close" | "wait">
  let last = ""
  const debounced = debounce(async (t: number) => {
    log.with({ t }).trace("debounced")
    last = ""
    await callback({ stdio, i: stdio.stdin.length, ...options })
  }, buffering)
  // Prepare stdin handlers if channel is piped
  if (handle(channels.stdin) === "piped") {
    const writer = process.stdin.getWriter()
    Object.assign(options, {
      async write(content: string, newline = true) {
        const t = Date.now() - start
        if (channels.stdin) {
          log.with({ t, channel: "stdin" })[channels.stdin]?.(content)
        }
        stdio.stdio.push([t, 0, content])
        if (newline && (!content.endsWith("\n"))) {
          content += "\n"
        }
        await writer.write(encoder.encode(content))
        last = "stdin"
        writer.releaseLock()
      },
      async close() {
        try {
          writer.releaseLock()
          await process.stdin.close()
          log.with({ t: Date.now() - start, closed: "stdin" }).trace()
        } catch {
          // Ignore
        }
      },
      async wait(dt = 1000) {
        const t = Date.now() - start
        log.with({ t, waiting: dt }).trace()
        await delay(dt)
        debounced(t)
      },
    })
    debounced(Date.now() - start)
  }
  // Buffer output and debounce interaction callback
  await Promise.all(
    (["stdout", "stderr"] as const).filter((channel) => handle(channels[channel]) === "piped").map(async (channel) => {
      for await (const line of process[channel].pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream())) {
        const t = Date.now() - start
        const stdi = { stdout: 1, stderr: 2 }[channel] as 1 | 2
        if (channels[channel]) {
          log.with({ t, channel })[channels[channel]!]?.(line)
        }
        if ((stdio.stdio.length) && (last === channel)) {
          const previous = stdio.stdio.at(-1)!
          if (previous[1] === stdi) {
            previous[2] += `\n${line}`
          }
        } else {
          stdio.stdio.push([t, stdi, line])
        }
        last = channel
        debounced(t)
      }
    }),
  )
  debounced.flush()
  // Result
  const { success, code } = await process.status
  if ((!success) && _throw) {
    throw new EvalError(`${bin} exited with non-zero code ${code}:\n${stdio.stdout}\n${stdio.stderr}`)
  }
  return { success, code, ...stdio }
}
