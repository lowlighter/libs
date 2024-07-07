// Imports
import { Logger } from "@libs/logger"
import type { Nullable, record } from "@libs/typing"
export type { record }

/** Regex for `imports` parsing. */
const regex = /^(?<statement>import\s*(?:(?:\s+type)?\s+(?:[^\n]+?|(?:\{[\s\S]*?\}))\s+from\s+)?(?<quote>["']))(?<module>[^\n]+?)\k<quote>/gm

/** Resolves all imports from file content against an import map. */
export function unmap(content: string, imports: record<string>, { log = new Logger() } = {}): { result: string; resolved: number } {
  let resolved = 0
  const directories = Object.keys(imports).filter((module) => module.endsWith("/")) as string[]
  const result = content.replace(regex, function (match, statement, quote, module, i) {
    log.with({ i }).debug(match)
    let mapped = null as Nullable<string>
    if (module in imports) {
      mapped = imports[module]
    } else if (directories.some((directory) => module.startsWith(directory))) {
      const [directory] = directories.filter((directory) => module.startsWith(directory)).sort((a, b) => b.length - a.length)
      mapped = module.replace(directory, imports[directory])
    }
    if (typeof mapped === "string") {
      resolved++
      log.with({ i }).log(`${module} → ${mapped}`)
      return `${statement}${mapped}${quote}`
    }
    return match
  })
  return { result, resolved }
}
