// Imports
import type { Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Nullable }

/**
 * Parse the output of `git blame --line-porcelain`.
 *
 * If no `stdout` is provided, `git blame --line-porcelain <ref> -- <path>` is run synchronously to populate it.
 *
 * ```ts ignore
 * import { blame } from "./blame.ts"
 * for (const { sha, line, author, content } of blame("git/blame.ts")) {
 *   console.log(`${sha.substring(0, 7)} ${line.final} ${author.name} ${content}`)
 * }
 * ```
 */
export function blame(path: string, { stdout = "", ...options } = {} as BlameOptions): BlameEntry[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["blame", "--line-porcelain", ...(options.ref ? [options.ref] : []), "--", path], { sync: true, throw: true, cwd: options.cwd }))
  }
  const entries = [] as BlameEntry[]
  const lines = stdout.split("\n")
  let i = 0
  while (i < lines.length) {
    // Group header
    if (!lines[i]) {
      i++
      continue
    }
    const header = lines[i++].match(/^(?<sha>[0-9a-f]{40,}) (?<original>\d+) (?<final>\d+)(?: \d+)?$/)
    if (!header)
      throw new TypeError(`Failed to parse git blame entry: "${lines[i - 1]}"`)
    const { sha, original, final } = header.groups!
    // Porcelain tags
    const tags = {} as Record<string, string>
    while ((i < lines.length) && (!lines[i].startsWith("\t"))) {
      const tag = lines[i++]
      const separator = tag.indexOf(" ")
      tags[~separator ? tag.substring(0, separator) : tag] = ~separator ? tag.substring(separator + 1) : ""
    }
    // Content
    const content = lines[i++]?.substring(1) ?? ""
    const previous = tags.previous?.match(/^(?<sha>[0-9a-f]{40,})(?: (?<filename>.*))?$/)?.groups
    entries.push({
      sha,
      line: { original: Number(original), final: Number(final) },
      author: {
        name: tags.author ?? "",
        mail: tags["author-mail"] ?? "",
        time: Number(tags["author-time"]),
        tz: Number(tags["author-tz"]),
      },
      committer: {
        name: tags.committer ?? "",
        mail: tags["committer-mail"] ?? "",
        time: Number(tags["committer-time"]),
        tz: Number(tags["committer-tz"]),
      },
      summary: tags.summary ?? "",
      boundary: "boundary" in tags,
      previous: previous ? { sha: previous.sha, filename: previous.filename ?? "" } : null,
      filename: tags.filename ?? "",
      content,
    })
  }
  return entries
}

/** Options for {@linkcode blame()}. */
export type BlameOptions = {
  /**
   * The output returned by `git blame --line-porcelain`.
   *
   * If empty, the function will run `git blame --line-porcelain` synchronously to populate this field.
   */
  stdout?: string
  /** The revision to blame (defaults to the working tree state). */
  ref?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}

/** Git blame entry. */
export type BlameEntry = {
  /** Commit hash. */
  sha: string
  /** Line numbers (both in the file of the commit the line is attributed to, and in the resulting file). */
  line: {
    original: number
    final: number
  }
  /** Author. */
  author: {
    name: string
    mail: string
    time: number
    tz: number
  }
  /** Committer. */
  committer: {
    name: string
    mail: string
    time: number
    tz: number
  }
  /** Commit summary. */
  summary: string
  /** Whether the commit is a boundary commit. */
  boundary: boolean
  /** Previous commit attribution (`null` when the line was introduced by {@linkcode BlameEntry.sha}). */
  previous: Nullable<{ sha: string; filename: string }>
  /** File name in the commit the line is attributed to. */
  filename: string
  /** Line content. */
  content: string
}
