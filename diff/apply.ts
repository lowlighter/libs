// Imports
import { tokenize } from "./diff.ts"

/** Hunk header regular expression */
const HUNK_HEADER = /^@@ -(?<ai>\d+)(?:,(?<aj>\d+))? \+(?<bi>\d+)(?:,(?<bj>\d+))? @@/

/**
 * ANSI patterns
 * https://github.com/chalk/ansi-regex/blob/02fa893d619d3da85411acc8fd4e2eea0e95a9d9/index.js
 */
const ANSI_PATTERN = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))",
  ].join("|"),
  "g",
)

/**
 * Apply back an unified patch to a string.
 *
 * ```ts
 * import { apply } from "./apply.ts"
 * apply("foo\n", `--- a
 * +++ b
 * @@ -1 +1 @@
 * -foo
 * +foo
 * \\ No newline at end of file`)
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export function apply(a: string, patch: string): string {
  const patchable = patch.trim() ? tokenize(patch.replace(ANSI_PATTERN, "")) : []
  const b = tokenize(a)
  if (b.at(-1) === "\n") {
    b.pop()
  }
  let offset = 0
  let k = 0
  let newline = (patchable.length > 0) || (a.endsWith("\n"))
  const errors = []
  for (let i = 0; i < patchable.length; i++) {
    // Parse hunk header
    const header = patchable[i].match(HUNK_HEADER)
    if (!header) {
      continue
    }
    const { ai, aj, bi, bj } = Object.fromEntries(Object.entries(header.groups!).map(([k, v]) => [k, Number(v ?? 1)]))
    // Apply hunk
    try {
      let j = ai - 1 + offset
      const count = { aj: 0, bj: 0, context: 0 }
      k++
      while ((++i < patchable.length) && (!HUNK_HEADER.test(patchable[i]))) {
        const diff = patchable[i]
        switch (true) {
          case diff.startsWith("-"): {
            let [removed] = b.splice(j, 1)
            count.aj++
            if (removed !== diff.slice(1)) {
              removed ??= ""
              throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${removed.trim()}")`)
            }
            break
          }
          case diff.startsWith("+"):
            b.splice(j, 0, patchable[i].slice(1))
            j++
            count.bj++
            break
          case diff.startsWith(" "):
            if (b[j] !== diff.slice(1)) {
              b[j] ??= ""
              throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${b[j].trim()}")`)
            }
            j++
            count.context++
            break
          case diff === "\n":
            j++
            count.context++
            break
          case (i + 1 === patchable.length) && (diff === "\\ No newline at end of file\n"):
            newline = false
            break
        }
      }
      i--
      offset = j - (bi + bj)
      // Check hunk header counts
      count.bj += count.context
      count.aj += count.context
      if (count.bj !== bj) {
        throw new SyntaxError(`Patch ${k}: hunk header text b count mismatch (expected ${bj}, actual ${count.bj})`)
      }
      if (count.aj !== aj) {
        throw new SyntaxError(`Patch ${k}: hunk header text a count mismatch (expected ${aj}, actual ${count.aj})`)
      }
    } catch (error) {
      errors.push(error)
    }
  }
  // Return patched string
  if (!b.length) {
    newline = false
  }
  let result = b.join("")
  if ((result.endsWith("\n")) && (!newline)) {
    result = result.slice(0, -1)
  } else if (!result.endsWith("\n") && newline) {
    result += "\n"
  }
  if (errors.length) {
    throw new AggregateError(errors, result)
  }
  return result
}
