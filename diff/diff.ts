/**
 * Bram Cohen's patience diff algorithm TypeScript implementation
 *
 * The following code has been ported and rewritten by Simon Lecoq from Jonathan Trent's original work at:
 * https://github.com/jonTrent/PatienceDiff/blob/dev/PatienceDiff.js
 *
 * Significant changes includes:
 * - Edited to be usable as a proper EcmaScript module (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
 * - A single exported `diff()` function which generate a unified patch instead of a list of operations
 *   - This output is supposed to match the output of the `diff` command line tool
 * - Lot of code has moved or has been rewritten to match lowlighter's coding style
 * ________________________________________________________________________________
 *
 * Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 *
 * ________________________________________________________________________________
 *
 * Original work was public domain. (The Unlicense)
 * https://raw.githubusercontent.com/jonTrent/PatienceDiff/master/UNLICENSE.txt
 *
 * @module
 */

/** Options for {@link diff}. */
export type DiffOptions = {
  /** Colorize the output using ANSI escape codes. */
  colors?: boolean
  /** Number of unchanged context lines to display around each change (defaults to `3`). */
  context?: number
  /** Name of the first file, displayed after `--- ` in the patch header (defaults to `"a"`, e.g. `--- a/.github/deno_readme.html`). */
  a?: string
  /** Name of the second file, displayed after `+++ ` in the patch header (defaults to `"b"`, e.g. `+++ b/.github/deno_readme.html`). */
  b?: string
  /** Extra content prepended before the `---`/`+++` header lines (this is purely informative and is ignored by {@link apply}). */
  header?: string
}

/**
 * Compute unified patch from diff between two strings.
 *
 * Based on {@link https://bramcohen.livejournal.com/73318.html | Bram Cohen's patience diff algorithm}.
 * This function was ported and modified by {@link https://github.com/lowlighter | Simon Lecoq} based on the previous work of {@link https://github.com/jonTrent | Jonathan Trent}.
 *
 * ```ts
 * import { diff } from "./diff.ts"
 * diff("foo\n", "foo") // Returns the following unified patch:
 * ```
 * ```diff
 * --- a
 * +++ b
 * \@@ -1 +1 \@@
 * -foo
 * +foo
 * \ No newline at end of file
 * ```
 *
 * File names and an optional extended header may be customized through the {@link DiffOptions}.
 * ```ts
 * import { diff } from "./diff.ts"
 * diff("foo\n", "bar\n", {
 *   a: "a/file.txt",
 *   b: "b/file.txt",
 *   header: "diff --git a/file.txt b/file.txt\nindex 9f209e3..4651806 100644",
 * }) // Returns the following unified patch:
 * ```
 * ```diff
 * diff --git a/file.txt b/file.txt
 * index 9f209e3..4651806 100644
 * --- a/file.txt
 * +++ b/file.txt
 * \@@ -1 +1 \@@
 * -foo
 * +bar
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @author Jonathan Trent
 * @author Bram Cohen
 * @license MIT
 */
export function diff(a: string, b: string, options: DiffOptions = {}): string {
  const { colors = false, context = 3, a: nameA = "a", b: nameB = "b", header = "" } = options
  const { lines } = patience(tokenize(a), tokenize(b))
  const patch = render(lines, context, colors)
  return patch ? `${header ? `${header}\n` : ""}--- ${nameA}\n+++ ${nameB}\n${patch}` : ""
}

/** Render an edit script into a unified patch (hunk headers, context grouping and "no newline" markers). */
function render(lines: line[], context: number, colors: boolean): string {
  // Collect edited lines
  const n = lines.length
  const changed = [] as number[]
  for (let i = 0; i < n; i++) {
    if ((lines[i].a < 0) || (lines[i].b < 0))
      changed.push(i)
  }
  if (!changed.length)
    return ""
  // Compute prefix counts of a-side and b-side lines to derive hunk header positions
  const a = { before: new Array(n + 1).fill(0), count: 0, start: 0 }
  const b = { before: new Array(n + 1).fill(0), count: 0, start: 0 }
  for (let i = 0; i < n; i++) {
    a.before[i + 1] = a.before[i] + (lines[i].a >= 0 ? 1 : 0)
    b.before[i + 1] = b.before[i] + (lines[i].b >= 0 ? 1 : 0)
  }
  let patch = ""
  for (let ci = 0; ci < changed.length;) {
    // Merge subsequent changes into the same hunk when separated by at most twice the context of unchanged lines
    let end = changed[ci]
    let cj = ci + 1
    while ((cj < changed.length) && ((changed[cj] - end - 1) <= 2 * context)) {
      end = changed[cj]
      cj++
    }
    const start = Math.max(0, changed[ci] - context)
    const stop = Math.min(n - 1, end + context)
    // Compute hunk header
    a.count = a.before[stop + 1] - a.before[start]
    b.count = b.before[stop + 1] - b.before[start]
    a.start = a.count > 0 ? a.before[start] + 1 : a.before[start]
    b.start = b.count > 0 ? b.before[start] + 1 : b.before[start]
    const head = `@@ -${a.count === 1 ? a.start : `${a.start},${a.count}`} +${b.count === 1 ? b.start : `${b.start},${b.count}`} @@\n`
    patch += colors ? `\x1b[36m${head}\x1b[0m` : head
    for (let i = start; i <= stop; i++)
      patch += emit(lines[i], colors)
    ci = cj
  }
  return patch
}

/** Render a single edit script line, appending a "no newline at end of file" marker when the line lacks a trailing newline. */
function emit({ line, a, b }: line, colors: boolean): string {
  const type = (a >= 0) && (b >= 0) ? " " : (a >= 0 ? "-" : "+")
  const newline = line.endsWith("\n")
  let text = (type === " ") ? (line === "\n" ? "\n" : ` ${line}`) : `${type}${line}`
  if (!newline)
    text += "\n"
  const color = type === "+" ? "\x1b[32m" : type === "-" ? "\x1b[31m" : ""
  const body = (colors && color) ? `${color}${text}\x1b[0m` : text
  return newline ? body : `${body}\\ No newline at end of file\n`
}

/**
 * Tokenize text into text lines.
 *
 * Each returned line keeps its trailing newline, except the last one when the input does not end with a newline.
 * An empty string yields no lines.
 *
 * ```ts
 * import { tokenize } from "./diff.ts"
 * tokenize("foo\nbar") // Returns ["foo\n", "bar"]
 * ```
 */
export function tokenize(text: string): string[] {
  return text.replace(/\r\n/g, "\n").match(/[^\n]*\n|[^\n]+$/g) ?? []
}

/** Find unique lines between `i` and `j` */
function unique({ lines }: operand, i: number, j: number) {
  const occurrences = new Map<string, { index: number; count: number }>()
  for (; i <= j; i++) {
    const line = lines[i]
    if (occurrences.has(line)) {
      const entry = occurrences.get(line)!
      entry.count++
      entry.index = i
      continue
    }
    occurrences.set(line, { index: i, count: 1 })
  }
  return new Map<string, number>([...occurrences].filter(([_, { count }]) => count === 1).map(([key, { index }]) => [key, index]))
}

/** Find all unique common lines between `A[Ai...Aj]` and `B[Ai...Aj]` */
function common(A: operand, B: operand, Ai: number, Aj: number, Bi: number, Bj: number) {
  const a = unique(A, Ai, Aj)
  const b = unique(B, Bi, Bj)
  return new Map<string, position>([...a].filter(([line]) => b.has(line)).map(([line, index]) => [line, { a: index, b: b.get(line)! }]))
}

/** Compute Longest Common Subsequence */
function lcs(ab: ReturnType<typeof common>) {
  const lcs = [] as Array<position & { previous?: position }>
  const subsequences = [] as Array<typeof lcs>
  for (const [_, v] of ab) {
    let i = 0
    let hi = subsequences.length
    while (i < hi) {
      const mid = (i + hi) >> 1
      if (subsequences[mid].at(-1)!.b < v.b)
        i = mid + 1
      else
        hi = mid
    }
    subsequences[i] ??= []
    subsequences[i].push({ ...v, previous: i > 0 ? subsequences[i - 1].at(-1) : undefined })
  }
  if (subsequences.length) {
    lcs.push(subsequences.at(-1)!.at(-1)!)
    while (lcs.at(-1)!.previous)
      lcs.push(lcs.at(-1)!.previous!)
  }
  return lcs.reverse()
}

/** Register line entry in `result` */
function register(result: result, A: operand, B: operand, a: number, b: number) {
  const line = { line: 0 <= a ? A.lines[a] : B.lines[b], a, b } as line
  switch (true) {
    case b < 0:
      result.deleted++
      break
    case a < 0:
      result.added++
      break
  }
  result.lines.push(line)
}

/** Register submatches and recurse over common lines */
function submatch(result: result, A: operand, B: operand, Ai: number, Aj: number, Bi: number, Bj: number) {
  while ((Ai <= Aj) && (Bi <= Bj) && (A.lines[Ai] === B.lines[Bi]))
    register(result, A, B, Ai++, Bi++)
  const Tj = Aj
  while ((Ai <= Aj) && (Bi <= Bj) && (A.lines[Aj] === B.lines[Bj])) {
    Aj--
    Bj--
  }
  const ab = common(A, B, Ai, Aj, Bi, Bj)
  if (ab.size)
    recurse(result, A, B, Ai, Aj, Bi, Bj, ab)
  else
    myers(result, A, B, Ai, Aj, Bi, Bj)
  while (Aj < Tj)
    register(result, A, B, ++Aj, ++Bj)
}

/**
 * Register a minimal edit script between `A[Ai...Aj]` and `B[Bi...Bj]` using Eugene Myers' O(ND) algorithm.
 *
 * Used as a fallback when the patience algorithm cannot find any unique common line to anchor on,
 * so that regions of duplicate lines are diffed minimally rather than fully deleted then re-added.
 */
function myers(result: result, A: operand, B: operand, Ai: number, Aj: number, Bi: number, Bj: number) {
  const a = A.lines
  const b = B.lines
  const n = Aj - Ai + 1
  const m = Bj - Bi + 1
  const max = n + m
  const offset = max
  const v = new Array(2 * max + 1).fill(0)
  const trace = [] as number[][]
  // Record the furthest-reaching path for each edit distance `d` until the end is reached
  outer: for (let d = 0; d <= max; d++) {
    trace.push(v.slice())
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d) || ((k !== d) && (v[offset + k - 1] < v[offset + k + 1])) ? v[offset + k + 1] : v[offset + k - 1] + 1
      let y = x - k
      while ((x < n) && (y < m) && (a[Ai + x] === b[Bi + y])) {
        x++
        y++
      }
      v[offset + k] = x
      if ((x >= n) && (y >= m))
        break outer
    }
  }
  // Backtrack the recorded trace into an ordered edit script
  const ops = [] as line[]
  let x = n
  let y = m
  for (let d = trace.length - 1; d > 0; d--) {
    const w = trace[d]
    const k = x - y
    const previous = (k === -d) || ((k !== d) && (w[offset + k - 1] < w[offset + k + 1])) ? k + 1 : k - 1
    const px = w[offset + previous]
    const py = px - previous
    while ((x > px) && (y > py)) {
      ops.push({ line: a[Ai + x - 1], a: Ai + x - 1, b: Bi + y - 1 })
      x--
      y--
    }
    if (x > px) {
      ops.push({ line: a[Ai + x - 1], a: Ai + x - 1, b: -1 })
      x--
    } else {
      ops.push({ line: b[Bi + y - 1], a: -1, b: Bi + y - 1 })
      y--
    }
  }
  for (let i = ops.length - 1; i >= 0; i--)
    register(result, A, B, ops[i].a, ops[i].b)
}

/** Recurses on each LCS subsequences until there are none available */
function recurse(result: result, A: operand, B: operand, Ai: number, Aj: number, Bi: number, Bj: number, ab?: ReturnType<typeof common>) {
  const x = lcs(ab ?? common(A, B, Ai, Aj, Bi, Bj))
  if (!x.length) {
    submatch(result, A, B, Ai, Aj, Bi, Bj)
    return
  }
  if ((Ai < x[0].a) || (Bi < x[0].b))
    submatch(result, A, B, Ai, x[0].a - 1, Bi, x[0].b - 1)
  let i = 0
  for (; i < x.length - 1; i++)
    submatch(result, A, B, x[i].a, x[i + 1].a - 1, x[i].b, x[i + 1].b - 1)
  if (+(x[i].a <= Aj) | +(x[i].b <= Bj))
    submatch(result, A, B, x[i].a, Aj, x[i].b, Bj)
}

/** Bram Cohen's patience diff algorithm */
function patience(a: string[], b: string[]) {
  const A = { lines: a } as operand
  const B = { lines: b } as operand
  const result = { lines: [], added: 0, deleted: 0 } as result
  recurse(result, A, B, 0, A.lines.length - 1, 0, B.lines.length - 1)
  return result
}

/** Result */
type result = {
  lines: line[]
  added: number
  deleted: number
}

/** Line entry */
type line = { line: string } & position

/** Line position */
type position = { a: number; b: number }

/** Diff operand */
type operand = { lines: string[] }
