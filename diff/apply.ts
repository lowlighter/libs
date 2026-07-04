/**
 * Apply back an unified patch to a string.
 * @module
 */

// Imports
import { tokenize } from "./diff.ts"

/** Hunk header regular expression */
const HUNK_HEADER = /^@@ -(?<ai>\d+)(?:,(?<aj>\d+))? \+(?<bi>\d+)(?:,(?<bj>\d+))? @@/

/** No newline at end of file marker */
const NO_NEWLINE = "\\ No newline at end of file"

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
  const clean = patch.replace(ANSI_PATTERN, "")
  const patchable = clean.trim() ? clean.replace(/\n$/, "").split("\n") : []
  const b = tokenize(a)
  let offset = 0
  let k = 0
  const errors = []
  for (let i = 0; i < patchable.length; i++) {
    // Parse hunk header
    const header = patchable[i].match(HUNK_HEADER)
    if (!header)
      continue
    const { ai, aj, bj } = Object.fromEntries(Object.entries(header.groups!).map(([k, v]) => [k, Number(v ?? 1)]))
    // Apply hunk
    try {
      let j = (aj === 0 ? ai : ai - 1) + offset
      const count = { aj: 0, bj: 0, context: 0 }
      k++
      while ((++i < patchable.length) && (!HUNK_HEADER.test(patchable[i]))) {
        const diff = patchable[i]
        const token = `${diff.slice(1)}${patchable[i + 1] === NO_NEWLINE ? "" : "\n"}`
        switch (true) {
          case diff.startsWith("-"): {
            let [removed] = b.splice(j, 1)
            count.aj++
            if (removed !== token) {
              removed ??= ""
              throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${removed.trim()}")`)
            }
            break
          }
          case diff.startsWith("+"):
            b.splice(j, 0, token)
            j++
            count.bj++
            break
          case diff.startsWith(" "):
            if (b[j] !== token) {
              b[j] ??= ""
              throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${b[j].trim()}")`)
            }
            j++
            count.context++
            break
          case diff === "":
            if (b[j] !== "\n") {
              b[j] ??= ""
              throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "", actual "${b[j].trim()}")`)
            }
            j++
            count.context++
            break
          case diff === NO_NEWLINE:
            break
        }
      }
      i--
      offset += count.bj - count.aj
      // Check hunk header counts
      count.bj += count.context
      count.aj += count.context
      if (count.bj !== bj)
        throw new SyntaxError(`Patch ${k}: hunk header text b count mismatch (expected ${bj}, actual ${count.bj})`)
      if (count.aj !== aj)
        throw new SyntaxError(`Patch ${k}: hunk header text a count mismatch (expected ${aj}, actual ${count.aj})`)
    } catch (error) {
      errors.push(error)
    }
  }
  // Return patched string
  const result = b.join("")
  if (errors.length)
    throw new AggregateError(errors, result)
  return result
}
