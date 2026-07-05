// Imports
import type { Nullable, Promisable } from "@libs/typing"
import { getLogger, type Logger } from "@logtape/logtape"
import { TextLineStream } from "@std/streams"
import { debounce } from "@std/async/debounce"
export type { Logger, Promisable }

/**
 * Handling of a stdio channel.
 * - `"piped"`: the channel is captured into the {@link Result} and mirrored to a {@link https://logtape.org | LogTape} sub-logger.
 * - `"inherit"`: the channel is forwarded to the parent process.
 * - `null`: the channel is discarded.
 */
export type Channel = Nullable<"piped" | "inherit">

/** Run options. */
export type Options = {
  /**
   * Logger categories forwarded to {@link https://logtape.org | LogTape}'s `getLogger()`.
   * Each channel is mirrored through a sub-category (`stdin`, `stdout`, `stderr`) so the host application can route or filter them.
   * Defaults to `["run"]`.
   */
  logger?: string[]
  /** Environment variables. */
  env?: Deno.CommandOptions["env"]
  /** Current working directory. */
  cwd?: Deno.CommandOptions["cwd"]
  /** Raw arguments (Windows only). */
  raw?: boolean
  /** Handling of stdin. */
  stdin?: Channel
  /** Handling of stdout. */
  stdout?: Channel
  /** Handling of stderr. */
  stderr?: Channel
  /**
   * Stdin interaction callback.
   * Passing this option automatically pipes stdin.
   * See {@link Callback} for the interaction protocol.
   */
  callback?: Callback
  /**
   * Stdio buffering.
   * This is used to merge messages that are received relatively closely.
   * Buffering is skipped when a different channel is used in-between.
   */
  buffering?: number
  /** Abort signal. */
  signal?: Deno.CommandOptions["signal"]
  /**
   * Execute process synchronously.
   * Note that stdin is not usable in sync mode.
   */
  sync?: boolean
  /**
   * Run process in background.
   * This implies `sync: false`.
   */
  background?: boolean
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
export type Result = {
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

/** Handle to a process running in background. */
export type Background = {
  /** Send a signal to the process (defaults to `"SIGTERM"`). */
  kill: (signal?: Deno.Signal) => Promise<void>
  /** Prevent the process from keeping the parent process alive. */
  unref: () => void
  /** Process identifier. */
  pid: number
  /** Process result (resolves once the process exits). */
  result: Promise<Result>
  /** Kill the process and wait for it to fully terminate. */
  [Symbol.asyncDispose]: () => Promise<void>
}

/** Snapshot of the accumulated process stdio content. */
export type Snapshot = Pick<Result, "stdin" | "stdout" | "stderr">

/**
 * Stdin interaction callback.
 *
 * It is an async generator that lets you drive an interactive process with plain language constructs:
 * ```ts ignore
 * // Iterate over process output to react to new data.
 * // (one iteration per buffered event)
 * for await (const { stdout } of stdio) {
 *   // Use await to pause or poll for a condition
 *   await delay(1000)
 *   // Use yield to write to stdin (verbatim)
 *   yield "content\n"
 *   // Use return to close stdin and end the interaction
 *   return
 * }
 * ```
 *
 * If the generator throws, stdin is closed, the process is killed and the returned {@link Result} rejects with the thrown error.
 * When the process exits on its own, the `stdio` iterator ends, so a generator parked on `for await` completes naturally.
 */
export type Callback = (options: { stdio: AsyncIterable<Snapshot> }) => AsyncGenerator<string, void, unknown>

/** Text encoder */
const encoder = new TextEncoder()

/** Text decoder */
const decoder = new TextDecoder()

/** Default interaction: an empty generator that closes stdin immediately. */
const noop: Callback = async function* () {}

/**
 * Asynchronous version of {@link command} running in background.
 *
 * ```ts
 * import { command } from "./command.ts"
 * const process = command("deno", ["eval", "Deno.exit(0)"], { background: true })
 * await process.kill()
 * ```
 */
export function command(bin: string, args: string[], options?: Options & { sync?: false; background: true }): Background
/**
 * Asynchronous version of {@link command}.
 *
 * ```ts
 * import { command } from "./command.ts"
 * try {
 *   await command("deno", ["eval", "Deno.exit(1)"], { throw: true })
 * }
 * catch (error) {
 *   console.log(error)
 * }
 * ```
 */
export function command(bin: string, args: string[], options?: Options & { sync?: false; background?: false }): Promise<Result>
/**
 * Synchronous version of {@link command}.
 *
 * Note that stdin is not usable in sync mode and will always be empty.
 *
 * ```ts
 * import { command } from "./command.ts"
 * command("deno", ["--version"], { sync: true })
 * ```
 * ```ts
 * import { command } from "./command.ts"
 * try {
 *   command("deno", ["eval", "Deno.exit(1)"], { sync: true, throw: true })
 * }
 * catch (error) {
 *   console.log(error)
 * }
 * ```
 */
export function command(bin: string, args: string[], options?: Options & { sync: true }): Result
/**
 * Run a command.
 *
 * This is a wrapper around {@link https://docs.deno.com/api/deno/~/Deno.Command | Deno.Command} that provides a better handling of stdio for interactive processes.
 *
 * Like `Deno.Command`, the `env`, `cwd`, and `raw` (alias for `windowsRawArguments`) options are supported.
 *
 * The `stdin`, `stdout` and `stderr` options accept `"piped"` (captured into the result and mirrored to a {@link https://logtape.org | LogTape} sub-logger), `"inherit"` (forwarded to the parent process) or `null` (discarded).
 *
 * Logging is performed through {@link https://logtape.org | LogTape}.
 * The `logger` option is a category forwarded to `getLogger()` (defaulting to `["run"]`), and each channel is mirrored through its own sub-category — `stdin` at `debug`, `stdout` at `info`, `stderr` at `error`.
 * As recommended for libraries, `command()` never configures LogTape itself: the host application is in charge of the actual output (through {@link https://logtape.org/manual/config | LogTape configuration}).
 *
 * Set `winext` option to automatically append an extension to the binary path on Windows (like `.cmd` or `.exe`).
 * This is useful when the binary path isn't automatically resolved on Windows.
 *
 * Pass a `callback` option (an async generator) to interact with the process stdin.
 * See {@link Callback} for the interaction protocol: `for await` over `stdio` to read output, `yield` to write to stdin, `return` to close it.
 *
 * The `buffering` option is used to merge messages that are received relatively closely.
 * Setting this option to a low value will also increase the rate at which the interaction generator is resumed.
 *
 * Resulting object contains the same properties as {@link https://docs.deno.com/api/deno/~/Deno.CommandStatus | Deno.CommandStatus}
 * with an additional `stdio` property that contains an array of ordered tuples with the delta timestamp since process start, the channel idenfitier (0:stdin, 1:stdout, 2:stderr) and the content.
 * This offers a proper history of exchanged content.
 *
 * ```ts
 * import { command } from "./command.ts"
 * await command("deno", ["--version"], { env: { NO_COLOR: "true" }, cwd: "/tmp", raw: true })
 * await command("deno", ["--version"], { stdout: "piped" })
 * await command("deno", ["--version"], { logger: ["my-app", "run"], stdout: "piped" })
 * await command("deno", ["--version"], { winext: ".exe" })
 * ```
 *
 * ```ts
 * import { command } from "./command.ts"
 *
 * const { stdout } = await command("deno", ["repl"], {
 *   env: { NO_COLOR: "true" },
 *   // Passing a callback automatically pipes stdin.
 *   // Iterate `stdio` to react to output, `yield` to write to stdin (verbatim), `return` to close it.
 *   callback: async function* ({ stdio }) {
 *     for await (const { stdout } of stdio) {
 *       if (!stdout.includes("exit using")) {
 *         continue
 *       }
 *       yield "console.log('hello')\n"
 *       return
 *     }
 *   },
 * })
 * console.assert(stdout.includes("hello"))
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 * @module
 */
export function command(
  bin: string,
  args: string[],
  { logger: category = ["run"], stdin = null, stdout = "piped", stderr = "piped", env, cwd, raw, callback, buffering, signal, sync, background, throw: _throw, dryrun, winext = "", os = Deno.build.os } = {} as Options,
): Promisable<Result> | Background {
  if (os === "windows")
    bin = `${bin}${winext}`
  const log = getLogger(category).with({ bin })
  if (callback && (handle(stdin) !== "piped"))
    stdin = "piped"
  const command = new Deno.Command(bin, { args, stdin: !sync ? handle(stdin) : "null", stdout: handle(stdout), stderr: handle(stderr), clearEnv: true, env, cwd, windowsRawArguments: raw, signal, detached: background })
  if (dryrun) {
    log.warn("dryrun: {bin} not executed", { bin })
    const result = { success: true, code: 0, stdio: [], stdin: "", stdout: "", stderr: "" }
    return sync ? result : Promise.resolve(result)
  }
  if (sync)
    return exec(command, { bin, log, throw: _throw, stdout, stderr })
  return spawn(command, { bin, log, callback, buffering, throw: _throw, background, stdin, stdout, stderr })
}

/** Returns the handle type for a given mode. */
function handle(mode: Channel) {
  return ["inherit", "null"].includes(`${mode}`) ? `${mode}` as "inherit" | "null" : "piped"
}

/** Execute a command synchronously. */
function exec(command: Deno.Command, { bin, log, throw: _throw, stdout, stderr }: { bin: string; log: Logger; throw?: boolean; stdout: Channel; stderr: Channel }) {
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
  } as Snapshot & Pick<Result, "stdio">
  for (const { channel, mode } of [{ channel: "stdout", mode: stdout }, { channel: "stderr", mode: stderr }] as const) {
    if ((handle(mode) === "piped") && (stdio[channel]))
      logged(log, channel, t, stdio[channel])
  }
  if ((!success) && _throw)
    throw new EvalError(`${bin} exited with non-zero code ${code}:\n${stdio.stdout}\n${stdio.stderr}`)
  return { success, code, ...stdio }
}

/** Spawn a command asynchronously in background. */
function spawn(
  command: Deno.Command,
  options: { bin: string; log: Logger; callback?: Callback; buffering?: number; throw?: boolean; background: true; stdin: Channel; stdout: Channel; stderr: Channel },
): Background
/** Spawn a command asynchronously. */
function spawn(command: Deno.Command, options: { bin: string; log: Logger; callback?: Callback; buffering?: number; throw?: boolean; background?: boolean; stdin: Channel; stdout: Channel; stderr: Channel }): Promise<Result>
/** Spawn a command. */
function spawn(
  command: Deno.Command,
  { bin, log, callback = noop, buffering = 250, throw: _throw, background, ...channels }: {
    bin: string
    log: Logger
    callback?: Callback
    buffering?: number
    throw?: boolean
    background?: boolean
    stdin: Channel
    stdout: Channel
    stderr: Channel
  },
) {
  const process = command.spawn()
  const status = process.status
  const start = Date.now()
  const stdio = {
    stdio: [],
    get stdin() {
      return this.stdio.filter(([_, i]) => i === 0).map(([_, __, content]) => content).join("")
    },
    get stdout() {
      return this.stdio.filter(([_, i]) => i === 1).map(([_, __, content]) => content).join("\n")
    },
    get stderr() {
      return this.stdio.filter(([_, i]) => i === 2).map(([_, __, content]) => content).join("\n")
    },
  } as Snapshot & Pick<Result, "stdio">
  let last = ""

  // Drive the interaction generator when stdin is piped
  let release = () => {}
  let notify = null as Nullable<() => void>
  let pending = true
  let ended = false
  let exited = false
  let interaction = Promise.resolve()
  if (handle(channels.stdin) === "piped") {
    const writer = process.stdin.getWriter()
    const close = async () => {
      try {
        await writer.close()
        log.with({ t: Date.now() - start }).trace("closed stdin")
      } catch {
        // Ignore (stdin may already be closed if the process exited)
      }
    }
    release = () => {
      ended = true
      notify?.()
      notify = null
    }
    const input = {
      async *[Symbol.asyncIterator]() {
        while (true) {
          if (pending) {
            pending = false
            yield stdio as Snapshot
            continue
          }
          if (ended)
            return
          await new Promise<void>((resolve) => notify = resolve)
        }
      },
    }
    interaction = (async () => {
      const generator = callback({ stdio: input })
      try {
        for await (const content of generator) {
          if (exited)
            throw new EvalError("Cannot write to stdin: process already exited")
          const t = Date.now() - start
          logged(log, "stdin", t, `${content}`)
          stdio.stdio.push([t, 0, `${content}`])
          await writer.write(encoder.encode(`${content}`))
          last = "stdin"
        }
        await close()
      } catch (error) {
        await close()
        abort(process)
        await status
        throw error
      }
    })()
  }

  // Buffer output and resume the interaction generator
  const debounced = debounce(() => {
    last = ""
    pending = true
    notify?.()
    notify = null
  }, buffering)
  const outputs = Promise.all(
    (["stdout", "stderr"] as const).filter((channel) => handle(channels[channel]) === "piped").map(async (channel) => {
      for await (const line of process[channel].pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream())) {
        const t = Date.now() - start
        const stdi = { stdout: 1, stderr: 2 }[channel] as 1 | 2
        logged(log, channel, t, line)
        if ((stdio.stdio.length) && (last === channel)) {
          const previous = stdio.stdio.at(-1)!
          if (previous[1] === stdi)
            previous[2] += `\n${line}`
        } else {
          stdio.stdio.push([t, stdi, line])
        }
        last = channel
        debounced()
      }
    }),
  )
  const settle = () => {
    exited = true
    release()
  }
  void status.then(settle, settle)

  // Compute result
  const result = (async () => {
    const [output, interacted] = await Promise.allSettled([outputs, interaction])
    debounced.clear()
    const { success, code } = await status
    if ((output.status === "rejected") || (interacted.status === "rejected"))
      throw ((output as { reason?: unknown }).reason ?? (interacted as { reason?: unknown }).reason)
    if ((!success) && _throw)
      throw new EvalError(`${bin} exited with non-zero code ${code}:\n${stdio.stdout}\n${stdio.stderr}`)
    return { success, code, ...stdio }
  })()
  const terminate = async (signal: Deno.Signal = "SIGTERM") => {
    abort(process, signal)
    await result.catch(() => {})
  }
  return background
    ? {
      kill: terminate,
      unref: () => process.unref(),
      pid: process.pid,
      result,
      [Symbol.asyncDispose]: () => terminate(),
    }
    : result
}

/** Send a signal to a process, ignoring the error raised when it has already terminated. */
function abort(process: Deno.ChildProcess, signal: Deno.Signal = "SIGTERM") {
  try {
    process.kill(signal)
  } catch {
    // Already terminated
  }
}

/** Mirror a stdio line through the channel's sub-logger. */
function logged(log: Logger, channel: "stdin" | "stdout" | "stderr", t: number, content: string) {
  const logger = log.getChild(channel).with({ t })
  switch (channel) {
    case "stdin":
      return void logger.debug("{content}", { content })
    case "stdout":
      return void logger.info("{content}", { content })
    case "stderr":
      return void logger.error("{content}", { content })
  }
}
