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

/** Pretty format used by {@linkcode tags()} when `commit` is enabled (NUL-separated fields to avoid ambiguity, annotated tags are dereferenced to their commit). */
const format = "%(refname:short)%00%(if)%(*objectname)%(then)%(*objectname)%(else)%(objectname)%(end)"

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
 *
 * When `commit` is enabled, a record mapping each tag name to the commit it points to is returned instead (annotated tags are dereferenced to their commit).
 *
 * ```ts ignore
 * import { tags } from "./tag.ts"
 * const { "v1.0.0": sha } = tags({ commit: true })
 * ```
 */
export function tags(options?: TagsOptions & { commit?: false }): string[]
export function tags(options: TagsOptions & { commit: true }): Record<string, string>
export function tags({ stdout = "", commit = false, ...options } = {} as TagsOptions): string[] | Record<string, string> {
  if (!stdout) {
    ;({ stdout } = command("git", ["tag", "--list", `--sort=${options.sort ?? "version:refname"}`, ...(commit ? [`--format=${format}`] : []), ...(options.glob ? [options.glob] : [])], { sync: true, throw: true, cwd: options.cwd }))
  }
  const lines = stdout.split("\n").filter(Boolean)
  if (!commit)
    return lines
  return Object.fromEntries(lines.map((line) => {
    const [name, sha, ...extra] = line.split("\0")
    if ((extra.length) || (!name) || (!/^[0-9a-f]{40,}$/.test(sha ?? "")))
      throw new TypeError(`Failed to parse git tag entry: "${line}"`)
    return [name, sha]
  }))
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
  /** Return a record mapping each tag name to the commit it points to rather than a list of tag names (annotated tags are dereferenced to their commit). */
  commit?: boolean
  /** Sort order (defaults to `version:refname`). */
  sort?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}
