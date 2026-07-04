// Imports
import { command } from "@libs/run/command"

/**
 * Run `git pull`.
 *
 * When `branch` is specified without a `remote`, the `origin` remote is used.
 *
 * ```ts ignore
 * import { pull } from "./pull.ts"
 * pull({ rebase: true })
 * ```
 */
export function pull({ remote = "", branch = "", rebase = false, args = [], cwd } = {} as PullOptions): string {
  if (branch && !remote)
    remote = "origin"
  const { stdout } = command("git", ["pull", ...(rebase ? ["--rebase"] : []), ...args, ...(remote ? [remote] : []), ...(branch ? [branch] : [])], { sync: true, throw: true, cwd })
  return stdout
}

/** Options for {@linkcode pull()}. */
export type PullOptions = {
  /** The remote to pull from (defaults to the tracked remote). */
  remote?: string
  /** The branch to pull (defaults to the tracked branch, implies `remote: "origin"` when no remote is specified). */
  branch?: string
  /** Rebase the current branch on top of the upstream branch after fetching (`--rebase`). */
  rebase?: boolean
  /** Additional flags passed to `git pull` (e.g. `["--ff-only"]`). */
  args?: string[]
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
