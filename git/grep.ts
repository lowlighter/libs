// Imports
import type { Arrayable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable }

/**
 * Parse the output of `git grep --line-number --column -I -z`.
 *
 * If no `stdout` is provided, `git grep --line-number --column -I -z <pattern> [-- <paths>]` is run synchronously to populate it.
 * A pattern without any match returns an empty array rather than throwing.
 *
 * The `-z` flag makes `git grep` delimit the path, line number and column with NUL characters, which makes the output unambiguous
 * (a colon-delimited output cannot be parsed reliably as both paths and content may contain colons).
 *
 * ```ts ignore
 * import { grep } from "./grep.ts"
 * for (const { path, line, column, content } of grep("TODO", { paths: ["*.ts"] })) {
 *   console.log(`${path}:${line}:${column} ${content.trim()}`)
 * }
 * ```
 */
export function grep(pattern: string, { stdout = "", ...options } = {} as GrepOptions): GrepEntry[] {
  if (!stdout) {
    const result = command("git", ["grep", "--line-number", "--column", "-I", "-z", ...(options.args ?? []), "-e", pattern, ...(options.paths?.length ? ["--", ...[options.paths].flat()] : [])], { sync: true, cwd: options.cwd })
    if (result.code > 1)
      throw new EvalError(`git grep exited with non-zero code ${result.code}:\n${result.stderr}`)
    ;({ stdout } = result)
  }
  const entries = [] as GrepEntry[]
  for (const line of stdout.split("\n").filter(Boolean)) {
    const match = line.match(/^(?<path>[^\0]+)\0(?<line>\d+)\0(?<column>\d+)\0(?<content>[\s\S]*)$/)
    if (!match)
      throw new TypeError(`Failed to parse git grep entry: "${line}"`)
    entries.push({
      path: match.groups!.path,
      line: Number(match.groups!.line),
      column: Number(match.groups!.column),
      content: match.groups!.content,
    })
  }
  return entries
}

/** Options for {@linkcode grep()}. */
export type GrepOptions = {
  /**
   * The output returned by `git grep --line-number --column -I -z`.
   *
   * If empty, the function will run `git grep --line-number --column -I -z` synchronously to populate this field.
   */
  stdout?: string
  /** Additional flags passed to `git grep` (e.g. `["--ignore-case", "--extended-regexp"]`). */
  args?: string[]
  /** Restrict the search to the given pathspecs. */
  paths?: Arrayable<string>
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}

/** Git grep entry. */
export type GrepEntry = {
  /** Matched file path. */
  path: string
  /** Matched line number (1-indexed). */
  line: number
  /** Matched column number (1-indexed). */
  column: number
  /** Matched line content. */
  content: string
}
