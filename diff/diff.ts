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

/**
 * Compute unified patch from diff between two strings.
 *
 * Based on {@link https://bramcohen.livejournal.com/73318.html | Bram Cohen's patience diff algorithm}.
 * This function was ported and modified by {@link https://gihub.com/lowlighter | Simon Lecoq} based on the previous work of {@link https://gihub.com/jonTrent | Jonathan Trent}.
 *
 * ```ts
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
export function diff(a: string, b: string, { colors = false, context = 3 } = {}): string {
  const hunks = [] as string[]
  const { lines } = patience(tokenize(a), tokenize(b))
  for (let after = -1; (after < lines.length)&&(!Number.isNaN(after));) {
    const {next, patch} = _diff(lines, { after, colors, context })
    hunks.push(patch)
    after = next
  }
  const patch = hunks.join("").trimEnd()
  return patch ? `--- a\n+++ b\n${patch}` : ""
}

function _diff(lines:line[], {after = -1, colors = false, context = 0}:{after?:number, context?:number, colors?:boolean}):{next:number, patch:string} {
  // Search for the first edited line after the specified index
  const k = lines.findIndex(({ a, b, token }, i) => ((a < 0) || (b < 0)) && (!token) && (i > after))
  if (k < 0) {
    return {next:NaN, patch:""}
  }
  const patch = [lines[k]]
  // Compute context lines
  for (const delta of [-1, 1]) {
    let contextual = context
    for (let i = k; (i >= 0) && (i < lines.length); i += delta) {
      // Skip current line
      if (i === k) {
        continue
      }
      // Prevent lines from the other file to be registered when going backward
      if ((delta < 0) && (lines[i].token === "!\n")) {
        break
      }
      // Register lines that are edited or within the context range
      if ((lines[i].a < 0) || (lines[i].b < 0) || ((contextual > 0) && (lines[i].a >= 0) && (lines[i].b >= 0))) {
        switch (true) {
          case delta < 0:
            patch.unshift(lines[i])
            break
          case delta > 0:
            patch.push(lines[i])
            break
        }
      }
      // Reset context on edited lines
      if ((lines[i].a < 0) || (lines[i].b < 0)) {
        contextual = context
      }
      // Decrease context range on common lines
      // If another edited line is found in the maximum context range, reset it to merge the current hunk with the next one
      if ((lines[i].a >= 0) && (lines[i].b >= 0)) {
        contextual--
        if ((delta > 0) && (!lines.slice(i + 1, i + 1 + context + 1).every(({a, b}) => (a >= 0) && (b >= 0)))) {
          contextual = context
        }
        if (contextual <= 0) {
          break
        }
      }
    }
  }
  // Compute patch
  let a = (patch.find(({a, token}) => (a >= 0) && (!token))?.a ?? -1 ) + 1
  let b = (patch.find(({b, token}) => (b >= 0) && (!token))?.b ?? -1 ) + 1
  const A = patch.filter(({a, token}) => (a >= 0) && (!token)).length;
  const B = patch.filter(({b, token}) => (b >= 0) && (!token)).length;
  if (context <= 1) {
    switch (true) {
      case A > 0:
        b = a-1
        break
      case B > 0:
        a = b
        break
    }
  }
  return {
    next: lines.indexOf(patch.findLast(({a, b, token}) => ((a < 0) || (b < 0)) && (!token))!),
    patch:[
      {line:`@@ -${a}${(A !== 1)||(a === 0) ? `,${A}` : ""} +${b}${(B !== 1)||(b === 0) ? `,${B}` : ""} @@\n`, a:NaN, b:NaN},
      ...patch,
    ].map(({line, a, b, token}) => {
      switch (true) {
        case token === "!\n":
          return "\\ No newline at end of file\n"
        case a < 0:
          return colors ? `\x1b[32m+${line}\x1b[0m` : `+${line}`
        case b < 0:
          return colors ? `\x1b[31m-${line}\x1b[0m` : `-${line}`
        case Number.isNaN(a) && Number.isNaN(b):
          return colors ? `\x1b[36m${line}\x1b[0m` : line
        default:
          return /^\r?\n$/.test(line) ? line : ` ${line}`
      }
    }).join("")
  }
}

/**
 * Tokenize text into text lines
 *
 * ```ts
 * import { tokenize } from "./diff.ts"
 * tokenize("foo\nbar")
 * ``
 */
export function tokenize(text: string): string[] {
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

/** Post-process result */
function postprocess(result:result) {
  const la = result.lines.findLast(({a}) => a >= 0)!
  const lb = result.lines.findLast(({b}) => b >= 0)!
  if ((la.line !== "\n") && (lb.line !== "\n")) {
    result.lines.push({line:"", a:la.a+1, b:lb.b+1, token:"!\n"})
  }
  else {
    if ((lb.line === "\n") && (lb.b >= 0) && (lb.a < 0)) {
      result.lines.splice(result.lines.indexOf(la), 1, {...la, b:-1}, {line:"", a:la.a+1, b:-1, token:"!\n"}, ...( (la.a >= 0) && (la.b >= 0) ? [{...la, b:la.a, a:-1}] : []))
      result.lines.splice(result.lines.indexOf(lb), 1)
    }
    if ((la.line === "\n") && (la.a >= 0) && (la.b < 0)) {
      result.lines.splice(result.lines.indexOf(lb), 1, ...( (lb.a >= 0) && (lb.b >= 0) ? [{...lb, a:lb.b, b:-1}] : []), {...lb, a:-1}, {line:"", a:-1, b:lb.b+1, token:"!\n"})
      result.lines.splice(result.lines.indexOf(la), 1)
    }
    if ((la === lb)&&(la.line === "\n")) {
      la.token = "\n"
    }
  }
}

/** Bram Cohen's patience diff algorithm */
function patience(a: string[], b: string[]) {
  const A = { lines: a } as operand
  const B = { lines: b } as operand
  const result = { lines: [], added: 0, deleted: 0 } as result
  recurse(result, A, B, 0, A.lines.length - 1, 0, B.lines.length - 1)
  postprocess(result)
  return result
}

/** Result */
type result = {
  lines: line[]
  added: number
  deleted: number
}

/** Line entry */
type line = { line: string, token?:string } & position

/** Line position */
type position = { a: number; b: number }

/** Diff operand */
type operand = { lines: string[] }
