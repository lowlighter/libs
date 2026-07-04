// Imports
import type { Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Nullable }

/** Unquote a path quoted by git (e.g. `"\303\251"`). */
function unquote(path: string): string {
  return path.replace(/\\(?:(?<octal>[0-7]{3})|(?<character>.))/g, (_, octal, character) => octal ? String.fromCharCode(parseInt(octal, 8)) : ({ n: "\n", t: "\t", r: "\r" }[character as string] ?? character))
}

/** Parse a path from a `diff --git a/<from> b/<to>` header, `rename`/`copy` header or `---`/`+++` line. */
function path(value: string): string {
  return value.startsWith('"') ? unquote(value.slice(1, -1)) : value
}

/**
 * Parse the output of `git diff`.
 *
 * If no `stdout` is provided, `git diff <range>` is run synchronously to populate it.
 *
 * Note that combined diffs (e.g. from merge commits) are not supported.
 *
 * ```ts ignore
 * import { diff } from "./diff.ts"
 * for (const { from, to, status, hunks } of diff("HEAD~1..HEAD")) {
 *   console.log(`${status} ${from} => ${to} (${hunks.length} hunks)`)
 * }
 * ```
 */
export function diff(range = "", { stdout = "", ...options } = {} as DiffOptions): DiffEntry[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["diff", ...(range ? [range] : [])], { sync: true, throw: true, cwd: options.cwd }))
  }
  const entries = [] as DiffEntry[]
  let entry = null as Nullable<DiffEntry>
  let hunk = null as Nullable<DiffHunk>
  let expected = { from: 0, to: 0 }
  let skip = false
  for (const line of stdout.split("\n")) {
    // File header
    if (line.startsWith("diff --git ")) {
      const header = line.match(/^diff --git (?<from>"(?:\\.|[^"])*"|a\/.*?) (?<to>"(?:\\.|[^"])*"|b\/.*)$/)
      if (!header)
        throw new TypeError(`Failed to parse git diff entry: "${line}"`)
      entry = {
        from: path(header.groups!.from).replace(/^a\//, ""),
        to: path(header.groups!.to).replace(/^b\//, ""),
        status: "modified",
        similarity: null,
        mode: { from: null, to: null },
        index: null,
        binary: false,
        hunks: [],
      }
      entries.push(entry)
      hunk = null
      skip = false
      continue
    }
    if (skip)
      continue
    // Hunk content
    if (hunk && ((expected.from > 0) || (expected.to > 0) || (line.startsWith("\\")))) {
      switch (line.charAt(0)) {
        case "\\":
          // e.g. `\ No newline at end of file`
          if (hunk.lines.length)
            hunk.lines[hunk.lines.length - 1].newline = false
          continue
        case "+":
          expected.to--
          hunk.lines.push({ type: "added", content: line.substring(1), newline: true })
          continue
        case "-":
          expected.from--
          hunk.lines.push({ type: "deleted", content: line.substring(1), newline: true })
          continue
        case " ":
        // Tolerate context lines whose trailing whitespace was stripped
        case "":
          expected.from--
          expected.to--
          hunk.lines.push({ type: "unchanged", content: line.substring(1), newline: true })
          continue
        default:
          throw new TypeError(`Failed to parse git diff hunk line: "${line}"`)
      }
    }
    if (!entry) {
      if (!line)
        continue
      throw new TypeError(`Failed to parse git diff entry: "${line}"`)
    }
    // Hunk header
    if (line.startsWith("@@")) {
      const header = line.match(/^@@ -(?<fline>\d+)(?:,(?<fcount>\d+))? \+(?<tline>\d+)(?:,(?<tcount>\d+))? @@(?: (?<context>.*))?$/)
      if (!header)
        throw new TypeError(`Failed to parse git diff hunk: "${line}"`)
      const { fline, fcount, tline, tcount, context = "" } = header.groups!
      hunk = {
        from: { line: Number(fline), count: Number(fcount ?? 1) },
        to: { line: Number(tline), count: Number(tcount ?? 1) },
        context,
        lines: [],
      }
      expected = { from: hunk.from.count, to: hunk.to.count }
      entry.hunks.push(hunk)
      continue
    }
    // Extended headers
    if (!line)
      continue
    if (/^old mode \d+$/.test(line)) {
      entry.mode.from = line.substring("old mode ".length)
      continue
    }
    if (/^new mode \d+$/.test(line)) {
      entry.mode.to = line.substring("new mode ".length)
      continue
    }
    if (/^new file mode \d+$/.test(line)) {
      entry.status = "created"
      entry.mode.to = line.substring("new file mode ".length)
      continue
    }
    if (/^deleted file mode \d+$/.test(line)) {
      entry.status = "deleted"
      entry.mode.from = line.substring("deleted file mode ".length)
      continue
    }
    if (/^(?:dis)?similarity index \d+%$/.test(line)) {
      entry.similarity = Number(line.match(/(?<similarity>\d+)%$/)!.groups!.similarity)
      continue
    }
    if (line.startsWith("rename from ")) {
      entry.status = "renamed"
      entry.from = path(line.substring("rename from ".length))
      continue
    }
    if (line.startsWith("rename to ")) {
      entry.status = "renamed"
      entry.to = path(line.substring("rename to ".length))
      continue
    }
    if (line.startsWith("copy from ")) {
      entry.status = "copied"
      entry.from = path(line.substring("copy from ".length))
      continue
    }
    if (line.startsWith("copy to ")) {
      entry.status = "copied"
      entry.to = path(line.substring("copy to ".length))
      continue
    }
    const index = line.match(/^index (?<from>[0-9a-f]+)\.\.(?<to>[0-9a-f]+)(?: (?<mode>\d+))?$/)
    if (index) {
      entry.index = { from: index.groups!.from, to: index.groups!.to }
      if (index.groups!.mode) {
        entry.mode.from ??= index.groups!.mode
        entry.mode.to ??= index.groups!.mode
      }
      continue
    }
    const from = line.match(/^--- (?<path>"(?:\\.|[^"])*"|a\/.*|\/dev\/null)$/)
    if (from) {
      if (from.groups!.path !== "/dev/null")
        entry.from = path(from.groups!.path).replace(/^a\//, "")
      continue
    }
    const to = line.match(/^\+\+\+ (?<path>"(?:\\.|[^"])*"|b\/.*|\/dev\/null)$/)
    if (to) {
      if (to.groups!.path !== "/dev/null")
        entry.to = path(to.groups!.path).replace(/^b\//, "")
      continue
    }
    if (/^Binary files .* differ$/.test(line)) {
      entry.binary = true
      continue
    }
    if (line === "GIT binary patch") {
      entry.binary = true
      skip = true
      continue
    }
    throw new TypeError(`Failed to parse git diff entry: "${line}"`)
  }
  return entries
}

/** Options for {@linkcode diff()}. */
export type DiffOptions = {
  /**
   * The output returned by `git diff`.
   *
   * If empty, the function will run `git diff` synchronously to populate this field.
   */
  stdout?: string
  /** The current working directory from which the `git` command is run. */
  cwd?: string
}

/** Git diff entry. */
export type DiffEntry = {
  /** Path before the change. */
  from: string
  /** Path after the change. */
  to: string
  /** Change status. */
  status: "modified" | "created" | "deleted" | "renamed" | "copied"
  /** Similarity percentage (only present for renames and copies). */
  similarity: Nullable<number>
  /** File mode before and after the change (`null` when unchanged or unknown). */
  mode: {
    from: Nullable<string>
    to: Nullable<string>
  }
  /** Blob hashes before and after the change. */
  index: Nullable<{ from: string; to: string }>
  /** Whether the file is binary. */
  binary: boolean
  /** Hunks. */
  hunks: DiffHunk[]
}

/** Git diff hunk. */
export type DiffHunk = {
  /** Starting line and number of lines in the file before the change. */
  from: { line: number; count: number }
  /** Starting line and number of lines in the file after the change. */
  to: { line: number; count: number }
  /** Contextual content displayed next to the hunk header. */
  context: string
  /** Hunk lines. */
  lines: DiffLine[]
}

/** Git diff hunk line. */
export type DiffLine = {
  /** Line type. */
  type: "added" | "deleted" | "unchanged"
  /** Line content (without the leading marker). */
  content: string
  /** Whether the line is terminated by a newline (`false` when followed by a `\ No newline at end of file` marker). */
  newline: boolean
}
