// deno-lint-ignore-file no-console
import type { Promisable } from "@libs/typing"
import { expect } from "./expect.ts"
import { basename, dirname, fromFileUrl } from "@std/path"
import { yellow } from "@std/fmt/colors"
export type { Promisable }
export * from "@std/assert"

/** Options for `assertConsoleSnapshot()`. */
export type AssertConsoleSnapshotOptions = {
  /** Whether to capture console output and update snapshots. Defaults to `Deno.args` including `--update-snapshots`. */
  capture?: boolean
}

/** Captures and matches console output against stored snapshots. */
export async function assertConsoleSnapshot(meta: ImportMeta, fn: () => Promisable<unknown>, { capture = Deno.args.includes("--update-snapshots") }: AssertConsoleSnapshotOptions = {}): Promise<void> {
  const path = fromFileUrl(meta.resolve(`./fixtures/snapshots/${basename(meta.url, ".ts")}`))
  const snapshot = {
    stdout: await Deno.readTextFile(`${path}.stdout.snap`).catch(() => ""),
    stderr: await Deno.readTextFile(`${path}.stderr.snap`).catch(() => ""),
  }
  const captured = { stdout: "", stderr: "" }
  const { log, error } = console
  try {
    console.log = (message: unknown) => captured.stdout += `${message}\n`
    console.error = (message: unknown) => captured.stderr += `${message}\n`
    await fn()
    if (capture) {
      const { ensureDir } = await import("@std/fs")
      await ensureDir(dirname(path))
      for (const channel of ["stdout", "stderr"] as const) {
        if (snapshot[channel] !== captured[channel]) {
          const filepath = `${path}.${channel}.snap`
          if (captured[channel]) {
            await Deno.writeTextFile(filepath, captured[channel])
            log(yellow(`> updated snapshot: ${filepath}`))
          } else {
            await Deno.remove(filepath)
            log(yellow(`> removed snapshot: ${filepath}`))
          }
        }
      }
    } else {
      expect(captured.stdout).toEqual(snapshot.stdout)
      expect(captured.stderr).toEqual(snapshot.stderr)
    }
  } finally {
    console.log = log
    console.error = error
  }
}
