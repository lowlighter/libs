// Imports
import type { Arrayable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable }

/**
 * Run `git push`.
 *
 * When no `refs` are specified, the current branch is pushed to the configured upstream.
 *
 * ```ts ignore
 * import { push } from "./push.ts"
 * push()
 * push("v1.0.0")
 * ```
 */
export function push(refs = [] as Arrayable<string>, { remote = "origin", args = [], cwd } = {} as PushOptions): string {
  const { stdout } = command("git", ["push", ...args, remote, ...[refs].flat()], { sync: true, throw: true, cwd })
  return stdout
}

/** Options for {@linkcode push()}. */
export type PushOptions = {
  /** The remote to push to. */
  remote?: string
  /** Additional flags passed to `git push` (e.g. `["--force-with-lease"]`). */
  args?: string[]
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
