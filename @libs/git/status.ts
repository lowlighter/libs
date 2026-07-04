// Imports
import type { Arrayable, Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable, Nullable }

/**
 * Parse the output of `git status --porcelain=v1 -z`.
 *
 * If no `stdout` is provided, `git status --porcelain=v1 -z [-- <paths>]` is run synchronously to populate it.
 * A clean working tree returns an empty array.
 *
 * The `-z` flag makes `git status` delimit entries with NUL characters, which makes the output unambiguous
 * (paths containing spaces or special characters are neither quoted nor escaped).
 *
 * ```ts ignore
 * import { status } from "./status.ts"
 * for (const { staged, unstaged, path } of status()) {
 *   console.log(`${staged}${unstaged} ${path}`)
 * }
 * ```
 */
export function status({ stdout = "", ...options } = {} as StatusOptions): StatusEntry[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["status", "--porcelain=v1", "-z", ...(options.paths?.length ? ["--", ...[options.paths].flat()] : [])], { sync: true, throw: true, cwd: options.cwd }))
  }
  const entries = [] as StatusEntry[]
  const tokens = stdout.split("\0").filter(Boolean)
  for (let i = 0; i < tokens.length; i++) {
    const match = tokens[i].match(/^(?<staged>[ MTADRCU?!])(?<unstaged>[ MTADRCU?!]) (?<path>[\s\S]+)$/)
    if (!match)
      throw new TypeError(`Failed to parse git status entry: "${tokens[i]}"`)
    const { staged, unstaged, path } = match.groups!
    let from = null as Nullable<string>
    if (/[RC]/.test(`${staged}${unstaged}`)) {
      from = tokens[++i]
      if (!from)
        throw new TypeError(`Failed to parse git status entry: "${tokens[i - 1]}" (missing origin path)`)
    }
    entries.push({ staged, unstaged, path, from })
  }
  return entries
}

/** Options for {@linkcode status()}. */
export type StatusOptions = {
  /**
   * The output returned by `git status --porcelain=v1 -z`.
   *
   * If empty, the function will run `git status --porcelain=v1 -z` synchronously to populate this field.
   */
  stdout?: string
  /** Restrict the status to the given pathspecs. */
  paths?: Arrayable<string>
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}

/**
 * Git status entry.
 *
 * The {@linkcode StatusEntry.staged} and {@linkcode StatusEntry.unstaged} fields contain the {@link https://git-scm.com/docs/git-status#_short_format | short format} status codes
 * (`M` modified, `T` type changed, `A` added, `D` deleted, `R` renamed, `C` copied, `U` unmerged, `?` untracked, `!` ignored, ` ` unmodified).
 */
export type StatusEntry = {
  /** Status of the index (staged changes). */
  staged: string
  /** Status of the working tree (unstaged changes). */
  unstaged: string
  /** File path. */
  path: string
  /** Original file path (`null` unless renamed or copied). */
  from: Nullable<string>
}
