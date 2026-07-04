// Imports
import type { Arrayable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable }

/** GitHub actions bot identity, used as default author by {@linkcode commit()}. */
export const bot = { name: "github-actions[bot]", mail: "41898282+github-actions[bot]@users.noreply.github.com" } as const

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
 * import { listChanged } from "./utils.ts"
 * if (listChanged(["git/**", ".github/workflows/*.yml"], { base: "origin/main" }).length) {
 *   console.log("changed!")
 * }
 * ```
 */
export function listChanged(globs: Arrayable<string>, { stdout = "", ...options } = {} as ListChangedOptions): string[] {
  if (!stdout) {
    const range = options.base ? [`${options.base}...${options.head ?? "HEAD"}`] : []
    ;({ stdout } = command("git", ["diff", "--name-only", "-z", ...range, "--", ...[globs].flat().map((glob) => `:(glob)${glob}`)], { sync: true, throw: true, cwd: options.cwd }))
  }
  return stdout.split("\0").filter(Boolean)
}

/** Options for {@linkcode listChanged()}. */
export type ListChangedOptions = {
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

/**
 * Run `git commit`, authored by the {@linkcode bot | github-actions bot} by default.
 *
 * The given `paths` are staged with `git add` prior to committing (use `all: true` to stage everything instead).
 * The identity is passed through `-c user.name=<name> -c user.email=<mail>` so it applies to both the author and the committer without touching the git configuration.
 *
 * Returns the sha of the created commit.
 *
 * ```ts ignore
 * import { commit } from "./utils.ts"
 * commit("chore: update generated files", { paths: ["README.md"] })
 * ```
 */
export function commit(message: string, { paths = [], all = false, author = bot, cwd } = {} as CommitOptions): string {
  if (all)
    command("git", ["add", "--all"], { sync: true, throw: true, cwd })
  else if ([paths].flat().length)
    command("git", ["add", "--", ...[paths].flat()], { sync: true, throw: true, cwd })
  command("git", ["-c", `user.name=${author.name}`, "-c", `user.email=${author.mail}`, "commit", "--message", message], { sync: true, throw: true, cwd })
  return command("git", ["rev-parse", "HEAD"], { sync: true, throw: true, cwd }).stdout.trim()
}

/** Options for {@linkcode commit()}. */
export type CommitOptions = {
  /** Pathspecs to stage with `git add` prior to committing (only previously staged changes are committed when empty). */
  paths?: Arrayable<string>
  /** Stage all changes with `git add --all` prior to committing (takes precedence over `paths`). */
  all?: boolean
  /** Commit identity (defaults to the {@linkcode bot | github-actions bot}). */
  author?: { name: string; mail: string }
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
