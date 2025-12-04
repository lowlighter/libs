// Imports
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import { bgBlack, bgWhite, bgYellow, black, blue, cyan, gray, green, stripAnsiCode, underline, yellow } from "@std/fmt/colors"
import { unescape } from "@std/html/entities"
hljs.registerLanguage("typescript", typescript)

/**
 * Syntax highlights code strings within backticks with ANSI codes.
 *
 * ```ts
 * import { highlight } from "./highlight.ts"
 * console.log(highlight("`const foo = 'bar'`"))
 * ```
 */
export function highlight(text: string, { underline: underlined = false, header = "", type = "" } = {} as { underline?: boolean; header?: string; type?: string }): string {
  text = text
    .replace(/`([^`]*?)`/g, (_, content) => {
      let highlighted = process(unescape(hljs.highlight(content, { language: "typescript" }).value))
      if (underlined) {
        highlighted = underline(highlighted)
      }
      return highlighted
    })
  let background = bgWhite
  if (type === "warn") {
    text = yellow(stripAnsiCode(text))
    background = bgYellow
  }
  if (type === "debug") {
    text = gray(stripAnsiCode(text))
    background = bgBlack
  }
  if (header) {
    text = `${background(black(` ${header} `))} ${text}`
  }
  return text
}

/** Inspects the given value and returns a string representation. */
export function inspect(value: unknown): string {
  if (typeof value === "function") {
    return "fn"
  }
  try {
    return Deno.inspect(value, { colors: true, compact: true }).replace(/\n\s+/g, " ")
  } catch {
    return JSON.stringify(value)
  }
}

/** Process rendered highlight.js html back to cli formatted highlighing. */
function process(html: string) {
  const stack = []
  const regex = /(?<open><span[^>]*class="(?<classname>[^"]*)"[^>]*>)|(?<close><\/span>)/gs
  let match = null as ReturnType<typeof regex.exec>
  while ((match = regex.exec(html)) !== null) {
    const [captured] = match
    const { open, close, classname } = match.groups!
    if (open) {
      stack.push({ classname, a: match.index, b: match.index + captured.length })
    }
    if (close) {
      const { a, b, classname } = stack.pop()!
      return process(`${html.substring(0, a)}${color(html.substring(b, match.index), classname)}${html.substring(match.index + close.length)}`)
    }
  }
  return html
}

/** Color content according to highlight.js classname. */
function color(content: string, classname: string) {
  return ({
    "hljs-comment": gray,
    "hljs-keyword": cyan,
    "hljs-string": green,
    "hljs-title function_": blue,
    "hljs-title class_": blue,
    "hljs-literal": yellow,
    "hljs-number": yellow,
  }[classname] ?? ((text: string) => text))(content)
}
