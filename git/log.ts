// Imports
import type { Arrayable, Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Arrayable, Nullable }

/**
 * Parse the output of `git log --pretty=<<%H>> <<%at>> <<%an>> %s`.
 */
export function log(sha: string, { stdout = "", ...options } = {} as LogOptions): LogEntry[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["log", "--pretty=<<%H>> <<%at>> <<%an>> %s", `${sha}..${options?.head ?? ""}`], { sync: true, throw: true }))
  }
  // Parse entries
  let entries = []
  for (const line of stdout.trim().split("\n")) {
    const { sha, author, time, summary } = line.match(/^<<(?<sha>.{40})>> <<(?<time>\d+)>> <<(?<author>.*)>> (?<summary>.*)$/)!.groups!
    const match = summary.match(/^(?<type>[^\(\):]+)(?:\((?<scopes>[^\(\):]+)\))?(?<breaking>!?):\s+(?<subject>[\s\S]*)/)?.groups
    entries.push({
      sha,
      author,
      time: Number(time),
      conventional: !!match,
      type: match?.type ?? null,
      scopes: match?.scopes?.split(",").map((scope) => scope.trim()) ?? [],
      breaking: match ? !!match?.breaking : null,
      subject: match?.subject ?? summary,
      summary,
    })
  }
  // Filter entries
  if (options?.filter?.conventional) {
    entries = entries.filter(({ conventional }) => conventional)
  }
  if (options?.filter?.breaking) {
    entries = entries.filter(({ breaking }) => breaking)
  }
  if (options?.filter?.types) {
    entries = entries.filter(({ type }) => [options?.filter?.types].filter(Boolean).flat().includes(type as string))
  }
  if (options?.filter?.scopes?.length) {
    entries = entries.filter(({ scopes }) => scopes.some((scope) => [options?.filter?.scopes].filter(Boolean).flat().includes(scope)))
  }
  return entries
}

/** Options for {@linkcode log()}. */
export type LogOptions = {
  /**
   * The output returned by `git log --pretty=<<%H>> <<%at>> <<%an>> %s`.
   *
   * If empty, the function will run `git log --pretty=<<%H>> <<%at>> <<%an>> %s` synchronously to populate this field.
   */
  stdout?: string
  /** The commit sha to compare against. */
  head?: string
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
  sha: string
  author: string
  time: number
  conventional: boolean
  type: Nullable<string>
  scopes: string[]
  breaking: Nullable<boolean>
  subject: string
  summary: string
}
