/**
 * Compute a blame output from a list of unified patches.
 * @module
 */

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
 * Compute a blame output from a list of unified patches.
 *
 * Patches are applied in order onto an initially empty text, and each resulting line is attributed the metadata of the last patch that introduced it.
 * Unchanged context lines keep their attribution, while lines that are moved by a patch (i.e. removed and re-added with the same content) are re-attributed:
 * - if the metadata is a string (or any non-plain object), it is simply replaced by the new patch metadata
 * - if the metadata is a plain object, it is merged with the previous attribution (only the properties present in the new patch metadata are replaced)
 *
 * Metadata is extracted from each patch by the {@linkcode BlameOptions.parser | parser} option.
 * By default, it is the informative header of the patch (the content preceding the `---` line, which can be set through {@link https://jsr.io/@libs/diff/doc/diff | diff}'s `header` option),
 * falling back on the patch index when absent.
 *
 * Returned lines keep their trailing newline (except the last one when the text does not end with a newline),
 * so that joining them back yields the patched text.
 *
 * ```ts
 * import { blame } from "./blame.ts"
 * import { diff } from "./diff.ts"
 * const a = "foo\nbar\n"
 * const b = "foo\nbaz\n"
 * blame([
 *   diff("", a, { header: "alice" }),
 *   diff(a, b, { header: "bob" }),
 * ]) // Returns [["foo\n", "alice"], ["baz\n", "bob"]]
 * ```
 *
 * Metadata can be customized through the {@linkcode BlameOptions.parser | parser} option.
 * ```ts
 * import { blame } from "./blame.ts"
 * import { diff } from "./diff.ts"
 * const a = "foo\nbar\n"
 * const b = "foo\nbaz\n"
 * blame<{ sha: string }>([
 *   diff("", a, { header: "9f209e3" }),
 *   diff(a, b, { header: "4651806" }),
 * ], { parser: (patch) => ({ sha: patch.split("\n")[0] }) }) // Returns [["foo\n", { sha: "9f209e3" }], ["baz\n", { sha: "4651806" }]]
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export function blame<T = string>(patches: string[], options: BlameOptions<T> = {}): Array<[line: string, meta: T]> {
  const { parser = header as unknown as NonNullable<BlameOptions<T>["parser"]> } = options
  const entries = [] as Array<[line: string, meta: T]>
  const errors = []
  for (let p = 0; p < patches.length; p++) {
    const meta = parser(patches[p], p)
    const clean = patches[p].replace(ANSI_PATTERN, "")
    const patchable = clean.trim() ? clean.replace(/\n$/, "").split("\n") : []
    const removed = new Map<string, T[]>()
    const added = [] as Array<[line: string, meta: T]>
    let offset = 0
    let k = 0
    for (let i = 0; i < patchable.length; i++) {
      // Parse hunk header
      const head = patchable[i].match(HUNK_HEADER)
      if (!head)
        continue
      const { ai, aj, bj } = Object.fromEntries(Object.entries(head.groups!).map(([k, v]) => [k, Number(v ?? 1)]))
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
              const [deletion] = entries.splice(j, 1)
              count.aj++
              if (deletion?.[0] !== token)
                throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${(deletion?.[0] ?? "").trim()}")`)
              const key = token.replace(/\n$/, "")
              if (!removed.has(key))
                removed.set(key, [])
              removed.get(key)!.push(deletion[1])
              break
            }
            case diff.startsWith("+"): {
              const entry = [token, copy(meta)] as [line: string, meta: T]
              entries.splice(j, 0, entry)
              added.push(entry)
              j++
              count.bj++
              break
            }
            case diff.startsWith(" "):
              if (entries[j]?.[0] !== token)
                throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "${diff.slice(1).trim()}", actual "${(entries[j]?.[0] ?? "").trim()}")`)
              j++
              count.context++
              break
            case diff === "":
              if (entries[j]?.[0] !== "\n")
                throw new SyntaxError(`Patch ${k}: line ${j} mismatch (expected "", actual "${(entries[j]?.[0] ?? "").trim()}")`)
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
    // Re-attribute moved lines (removed and re-added with the same content by the current patch)
    for (const entry of added) {
      const pool = removed.get(entry[0].replace(/\n$/, ""))
      if (pool?.length)
        entry[1] = merge(pool.shift()!, meta)
    }
  }
  // Return blamed lines
  if (errors.length)
    throw new AggregateError(errors, entries.map(([line]) => line).join(""))
  return entries
}

/** Default {@linkcode BlameOptions.parser | parser}, extracting the informative header of a patch and falling back on its index. */
function header(patch: string, index: number): string {
  const lines = patch.replace(ANSI_PATTERN, "").split("\n")
  const i = lines.findIndex((line) => line.startsWith("--- "))
  return (~i ? lines.slice(0, i).join("\n").trim() : "") || `${index}`
}

/** Check whether a metadata value is a plain object. */
function object(meta: unknown): meta is Record<PropertyKey, unknown> {
  return (typeof meta === "object") && (meta !== null) && (!Array.isArray(meta))
}

/** Shallow copy metadata so each line owns its own attribution. */
function copy<T>(meta: T): T {
  return object(meta) ? { ...meta } as T : meta
}

/** Merge the previous attribution of a moved line with new metadata (plain objects only replace the properties present in the new metadata, anything else is replaced). */
function merge<T>(previous: T, meta: T): T {
  return (object(previous) && object(meta)) ? { ...previous, ...meta } as T : copy(meta)
}

/** Options for {@linkcode blame()}. */
export type BlameOptions<T = string> = {
  /**
   * Parse the metadata attributed to lines introduced by a patch.
   *
   * It is called once per patch with the raw patch and its index, and defaults to extracting the informative header of the patch
   * (the content preceding the `---` line), falling back on the patch index when absent.
   */
  parser?: (patch: string, index: number) => T
}
