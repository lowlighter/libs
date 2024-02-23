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
 * Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 *
 * ________________________________________________________________________________
 *
 * Original work was public domain. (The Unlicense)
 * https://raw.githubusercontent.com/jonTrent/PatienceDiff/master/UNLICENSE.txt
 */

/**
 * Compute unified patch from diff between two strings.
 *
 * Based on {@link https://bramcohen.livejournal.com/73318.html | Bram Cohen's patience diff algorithm}.
 * This function was ported and modified by {@link https://gihub.com/lowlighter | Simon Lecoq} based on the previous work of {@link https://gihub.com/jonTrent | Jonathan Trent}.
 *
 * @example
 * ```
 * import { diff } from "./diff.ts"
 * diff("foo\n", "foo")
 * // Returns
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
 * @author Simon Lecoq (lowlighter)
 * @author Jonathan Trent
 * @author Bram Cohen
 * @license MIT
 */
export function diff(a: string, b: string, { context = 3 } = {}) {
  let patch = ""
  const { lines } = patience(tokenize(a), tokenize(b))
  const cursor = { a: -1, b: -1 }
  for (let i = 0; i < lines.length; i++) {
    const { a, b } = lines[i]
    Object.assign(cursor, { a: Math.max(a, cursor.a), b: Math.max(b, cursor.b) })
    if ((a < 0) || (b < 0)) {
      const hunk = { lines: [] as string[], a: -1, b: -1, context, added: 0, deleted: 0 }
      let j = Math.max(0, i - context)
      while (j < lines.length) {
        const { line, a, b } = lines[j]
        if ((a >= 0) && (b >= 0)) {
          if (line === "\n") {
            if (j === lines.length - 1) {
              break
            }
            hunk.lines.push(line)
          } else {
            hunk.lines.push(` ${line}`)
          }
          hunk.context--
          hunk.added++
          hunk.deleted++
          if (hunk.context <= 0) {
            if (!lines.slice(j, j + 2 * context - 1).some(({ a, b }) => (a < 0) || (b < 0))) {
              break
            }
          }
        }
        if ((hunk.a < 0) && (a >= 0)) {
          hunk.a = a
        }
        if ((hunk.b < 0) && (b >= 0)) {
          hunk.b = b
        }
        if (a < 0) {
          hunk.lines.push(`+${line}`)
          hunk.added++
          hunk.context = context
        }
        if (b < 0) {
          if ((j === lines.length - 1) && (line === "\n")) {
            const previous = hunk.lines.pop()!.slice(1)
            hunk.lines.push(`-${previous}`)
            hunk.lines.push(`+${previous}`)
            hunk.lines.push("\\ No newline at end of file")
            break
          }
          hunk.lines.push(`-${line}`)
          hunk.deleted++
          hunk.context = context
        }
        j++
      }
      i = j
      if (hunk.a < 0) {
        hunk.a = cursor.a
      }
      if (hunk.b < 0) {
        hunk.b = cursor.b
      }
      hunk.lines.unshift(`@@ -${hunk.a + 1}${hunk.deleted !== 1 ? `,${hunk.deleted}` : ""} +${hunk.b + 1}${hunk.added !== 1 ? `,${hunk.added}` : ""} @@\n`)
      if (!patch) {
        patch += `--- a\n+++ b\n`
      }
      patch += hunk.lines.join("")
    }
  }
  return patch
}

/**
 * Tokenize text into text lines
 *
 * @example
 * ```
 * import { tokenize } from "./diff.ts"
 * tokenize("foo\nbar")
 * ``
 */
export function tokenize(text: string) {
  text += "\n"
  return [...text.matchAll(/.*(?:\r?\n)/g)].map(([token]) => token.replace(/\r\n$/, "\n")).filter((token) => token)
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
    while (subsequences.at(i)?.at(-1)?.b! < v.b) {
      i++
    }
    subsequences[i] ??= []
    subsequences[i].push({ ...v, previous: (i > 0 ? subsequences.at(i - 1)?.at(-1) : undefined) })
  }
  if (subsequences.length) {
    lcs.push(subsequences.at(-1)!.at(-1)!)
    while (lcs.at(-1)!.previous) {
      lcs.push(lcs.at(-1)!.previous!)
    }
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
  while ((Ai <= Aj) && (Bi <= Bj) && (A.lines[Ai] === B.lines[Bi])) {
    register(result, A, B, Ai++, Bi++)
  }
  const Tj = Aj
  while ((Ai <= Aj) && (Bi <= Bj) && (A.lines[Aj] === B.lines[Bj])) {
    Aj--
    Bj--
  }
  const ab = common(A, B, Ai, Aj, Bi, Bj)
  if (ab.size) {
    recurse(result, A, B, Ai, Aj, Bi, Bj, ab)
  } else {
    while (Ai <= Aj) {
      register(result, A, B, Ai++, -1)
    }
    while (Bi <= Bj) {
      register(result, A, B, -1, Bi++)
    }
  }
  while (Aj < Tj) {
    register(result, A, B, ++Aj, ++Bj)
  }
}

/** Recurses on each LCS subsequences until there are none available */
function recurse(result: result, A: operand, B: operand, Ai: number, Aj: number, Bi: number, Bj: number, ab?: ReturnType<typeof common>) {
  const x = lcs(ab ?? common(A, B, Ai, Aj, Bi, Bj))
  if (!x.length) {
    submatch(result, A, B, Ai, Aj, Bi, Bj)
    return
  }
  if ((Ai < x[0].a) || (Bi < x[0].b)) {
    submatch(result, A, B, Ai, x[0].a - 1, Bi, x[0].b - 1)
  }
  let i = 0
  for (; i < x.length - 1; i++) {
    submatch(result, A, B, x[i].a, x[i + 1].a - 1, x[i].b, x[i + 1].b - 1)
  }
  if (+(x[i].a <= Aj) | +(x[i].b <= Bj)) {
    submatch(result, A, B, x[i].a, Aj, x[i].b, Bj)
  }
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
