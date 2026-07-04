// Imports
import { command } from "@libs/run/command"

/**
 * Run `git tag` to create a new tag.
 *
 * ```ts ignore
 * import { tag } from "./tag.ts"
 * tag("v1.0.0")
 * ```
 */
export function tag(name: string, { ref = "", message = "", force = false, cwd } = {} as TagOptions): void {
  command("git", ["tag", ...(force ? ["--force"] : []), ...(message ? ["--message", message] : []), name, ...(ref ? [ref] : [])], { sync: true, throw: true, cwd })
}

/**
 * Parse the output of `git tag --list`.
 *
 * If no `stdout` is provided, `git tag --list --sort=<sort> [glob]` is run synchronously to populate it.
 * Tags are sorted by version by default, meaning the latest version is the last element of the returned array.
 *
 * ```ts ignore
 * import { tags } from "./tag.ts"
 * const [latest] = tags({ glob: "v*" }).slice(-1)
 * ```
 */
export function tags({ stdout = "", ...options } = {} as TagsOptions): string[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["tag", "--list", `--sort=${options.sort ?? "version:refname"}`, ...(options.glob ? [options.glob] : [])], { sync: true, throw: true, cwd: options.cwd }))
  }
  return stdout.split("\n").filter(Boolean)
}

/** Options for {@linkcode tag()}. */
export type TagOptions = {
  /** The object the new tag refers to (defaults to `HEAD`). */
  ref?: string
  /** Create an annotated tag with the given message rather than a lightweight tag. */
  message?: string
  /** Replace an existing tag with the same name (`--force`). */
  force?: boolean
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}

/** Options for {@linkcode tags()}. */
export type TagsOptions = {
  /**
   * The output returned by `git tag --list`.
   *
   * If empty, the function will run `git tag --list` synchronously to populate this field.
   */
  stdout?: string
  /** Restrict the list to tags matching the given glob pattern. */
  glob?: string
  /** Sort order (defaults to `version:refname`). */
  sort?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
