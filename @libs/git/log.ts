// Imports
import type { Arrayable, Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable, Nullable }

/** Pretty format used by {@linkcode log()} (NUL-separated fields to avoid ambiguity). */
const format = "%H%x00%at%x00%an%x00%ae%x00%s"

/**
 * Parse the output of `git log --pretty=format:%H%x00%at%x00%an%x00%ae%x00%s`.
 *
 * If no `stdout` is provided, `git log` is run synchronously to populate it.
 * When `sha` is specified, only commits within the `<sha>..<head>` range are returned (defaults to the full history).
 *
 * Commit summaries following the {@link https://www.conventionalcommits.org | conventional commits} syntax are parsed into `type`, `scopes`, `breaking` and `subject`.
 *
 * ```ts ignore
 * import { log } from "./log.ts"
 * for (const { sha, type, subject } of log("1.0.0", { filter: { conventional: true } })) {
 *   console.log(`${sha.substring(0, 7)} ${type}: ${subject}`)
 * }
 * ```
 */
export function log(sha = "", { stdout = "", ...options } = {} as LogOptions): LogEntry[] {
  if (!stdout) {
    const range = sha ? `${sha}..${options.head ?? ""}` : options.head ?? ""
    ;({ stdout } = command("git", ["log", `--pretty=format:${format}`, ...(range ? [range] : [])], { sync: true, throw: true, cwd: options.cwd }))
  }
  // Parse entries
  let entries = [] as LogEntry[]
  for (const line of stdout.split("\n").filter(Boolean)) {
    const [sha, time, name, mail, summary, ...extra] = line.split("\0")
    if ((extra.length) || (summary === undefined) || (!/^[0-9a-f]{40,}$/.test(sha)) || (!/^\d+$/.test(time)))
      throw new TypeError(`Failed to parse git log entry: "${line}"`)
    const match = summary.match(/^(?<type>[^\s():]+)(?:\((?<scopes>[^():]+)\))?(?<breaking>!?):\s+(?<subject>[\s\S]*)/)?.groups
    entries.push({
      sha,
      author: { name, mail },
      time: Number(time),
      conventional: !!match,
      type: match?.type ?? null,
      scopes: match?.scopes?.split(",").map((scope) => scope.trim()) ?? [],
      breaking: match ? !!match.breaking : null,
      subject: match?.subject ?? summary,
      summary,
    })
  }
  // Filter entries
  if (options.filter?.conventional)
    entries = entries.filter(({ conventional }) => conventional)
  if (options.filter?.breaking)
    entries = entries.filter(({ breaking }) => breaking)
  if (options.filter?.types)
    entries = entries.filter(({ type }) => [options.filter?.types].filter(Boolean).flat().includes(type as string))
  if (options.filter?.scopes?.length)
    entries = entries.filter(({ scopes }) => scopes.some((scope) => [options.filter?.scopes].filter(Boolean).flat().includes(scope)))
  return entries
}

/** Options for {@linkcode log()}. */
export type LogOptions = {
  /**
   * The output returned by `git log --pretty=format:%H%x00%at%x00%an%x00%ae%x00%s`.
   *
   * If empty, the function will run `git log --pretty=format:%H%x00%at%x00%an%x00%ae%x00%s` synchronously to populate this field.
   */
  stdout?: string
  /** The commit sha to compare against (defaults to the current branch head). */
  head?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
  /** Filter the entries. */
  filter?: {
    /** Filter only conventional commits. */
    conventional?: boolean
    /** Filter by commit types (must follow conventional commits syntax). */
    types?: Arrayable<string>
    /** Filter by scopes (must follow conventional commits syntax). */
    scopes?: Arrayable<string>
    /** Filter by breaking changes (must follow conventional commits syntax). */
    breaking?: boolean
  }
}

/** Git log entry. */
export type LogEntry = {
  /** Commit hash. */
  sha: string
  /** Commit author. */
  author: {
    name: string
    mail: string
  }
  /** Commit timestamp (unix time). */
  time: number
  /** Whether the summary follows the {@link https://www.conventionalcommits.org | conventional commits} syntax. */
  conventional: boolean
  /** Commit type (`null` when not conventional). */
  type: Nullable<string>
  /** Commit scopes (empty when not conventional). */
  scopes: string[]
  /** Whether the commit is marked as breaking (`null` when not conventional). */
  breaking: Nullable<boolean>
  /** Commit subject (same as {@linkcode LogEntry.summary} when not conventional). */
  subject: string
  /** Commit summary. */
  summary: string
}
