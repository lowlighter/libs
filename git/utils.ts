// Imports
import type { Arrayable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable }

/**
 * List changed files matching the given glob patterns.
 *
 * Parse the output of `git diff --name-only -z [<base>...<head>] -- <globs>`.
 * If no `stdout` is provided, the command is run synchronously to populate it.
 *
 * When `base` is specified, files changed between the merge base of `base` and `head` are returned (which is how pull requests are diffed),
 * otherwise uncommitted changes from the working tree are returned.
 *
 * Globs are matched by git itself using the {@link https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-glob | `:(glob)` pathspec magic},
 * meaning `*` matches anything except `/` while `**` matches anything including `/`.
 *
 * ```ts ignore
 * import { changed } from "./utils.ts"
 * if (changed(["git/**", ".github/workflows/*.yml"], { base: "origin/main" }).length) {
 *   console.log("changed!")
 * }
 * ```
 */
export function changed(globs: Arrayable<string>, { stdout = "", ...options } = {} as ChangedOptions): string[] {
  if (!stdout) {
    const range = options.base ? [`${options.base}...${options.head ?? "HEAD"}`] : []
    ;({ stdout } = command("git", ["diff", "--name-only", "-z", ...range, "--", ...[globs].flat().map((glob) => `:(glob)${glob}`)], { sync: true, throw: true, cwd: options.cwd }))
  }
  return stdout.split("\0").filter(Boolean)
}

/** Options for {@linkcode changed()}. */
export type ChangedOptions = {
  /**
   * The output returned by `git diff --name-only -z`.
   *
   * If empty, the function will run `git diff --name-only -z` synchronously to populate this field.
   */
  stdout?: string
  /** The commit sha or ref to compare against (defaults to uncommitted changes from the working tree when unspecified). */
  base?: string
  /** The commit sha or ref to compare with (defaults to `HEAD`, ignored when no `base` is specified). */
  head?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
