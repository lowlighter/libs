// Imports
import type { Arrayable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable }

/** GitHub actions bot identity, used as default author by {@linkcode commit()}. */
export const bot = { name: "github-actions[bot]", mail: "41898282+github-actions[bot]@users.noreply.github.com" } as const

/**
 * Run `git commit`, authored by the {@linkcode bot | github-actions bot} by default.
 *
 * The given `paths` are staged with `git add` prior to committing (use `all: true` to stage everything instead).
 * The identity is passed through `-c user.name=<name> -c user.email=<mail>` so it applies to both the author and the committer without touching the git configuration.
 *
 * Returns the sha of the created commit.
 *
 * ```ts ignore
 * import { commit } from "./commit.ts"
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
