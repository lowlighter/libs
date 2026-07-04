/**
 * Syntax highlighting utilities for CLI output.
 * @module
 */
// Imports
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import css from "highlight.js/lib/languages/css"
import markdown from "highlight.js/lib/languages/markdown"
import xml from "highlight.js/lib/languages/xml"
import diff from "highlight.js/lib/languages/diff"
import yaml from "highlight.js/lib/languages/yaml"
import json from "highlight.js/lib/languages/json"
import { blue, bold, cyan, gray, green, italic, magenta, red, underline, yellow } from "@std/fmt/colors"
import { unescape } from "@std/html/entities"
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("css", css)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("diff", diff)
hljs.registerLanguage("yaml", yaml)
hljs.registerLanguage("json", json)

/** Options for {@linkcode highlight()}. */
export type HighlightOptions = {
  /** Whether to underline highlighted content. */
  underline?: boolean
  /** Whether to highlight content directly rather than content within backticks. */
  raw?: boolean
  /** Language used for highlighting. Supported languages are `typescript`, `css`, `markdown`, `html` (through `xml`), `diff`, `yaml` and `json`. */
  language?: string
}

/**
 * Syntax highlights code strings within backticks with ANSI codes.
 *
 * Content can also be highlighted directly (i.e. without backticks) using the `raw` option.
 *
 * ```ts
 * import { highlight } from "./mod.ts"
 * console.log(highlight("`const foo = 'bar'`"))
 * console.log(highlight("const foo = 'bar'", { raw: true }))
 * console.log(highlight("foo: bar", { raw: true, language: "yaml" }))
 * ```
 */
export function highlight(text: string, { underline: underlined = false, raw = false, language = "typescript" }: HighlightOptions = {}): string {
  const colorize = (content: string) => {
    let highlighted = process(unescape(hljs.highlight(content, { language }).value))
    if (underlined)
      highlighted = underline(highlighted)
    return highlighted
  }
  if (raw)
    return colorize(text)
  return text.replace(/`([^`]*?)`/g, (_, content) => colorize(content))
}

/** Inspects the given value and returns a string representation. */
export function inspect(value: unknown): string {
  if (typeof value === "function")
    return "fn"
  return Deno.inspect(value, { colors: true, compact: true, depth: Infinity })
    .replace(/\n\s+/g, " ")
    .replace(/AbortSignal \{[^}]+?\}/g, "AbortSignal")
    .replace(/\[Function: ([A-Z]\w*)\]/g, "$1")
    .replace(/\[Function: (\w*)\]/g, "Function")
    .replace(/\[Function \(anonymous\)]/g, "Function")
    .replace(/\{ \[class (\w+)\] [^}]+?\}/g, "$1")
    .replace(/\[Object: null prototype\] \{ url: [^,]+?, main: [^}]+?, filename: [^,]+?, dirname: [^,]+?\}/g, "import.meta")
}

/** Process rendered highlight.js html back to cli formatted highlighing. */
function process(html: string) {
  const stack = []
  const regex = /(?<open><span[^>]*class="(?<classname>[^"]*)"[^>]*>)|(?<close><\/span>)/gs
  let match = null as ReturnType<typeof regex.exec>
  while ((match = regex.exec(html)) !== null) {
    const [captured] = match
    const { open, close, classname } = match.groups!
    if (open)
      stack.push({ classname, a: match.index, b: match.index + captured.length })
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
    "hljs-quote": gray,
    "hljs-meta": gray,
    "hljs-code": gray,
    "hljs-keyword": cyan,
    "hljs-attr": cyan,
    "hljs-attribute": cyan,
    "hljs-type": cyan,
    "hljs-built_in": cyan,
    "hljs-string": green,
    "hljs-regexp": green,
    "hljs-addition": green,
    "hljs-deletion": red,
    "hljs-literal": yellow,
    "hljs-number": yellow,
    "hljs-bullet": yellow,
    "hljs-symbol": yellow,
    "hljs-title function_": blue,
    "hljs-title class_": blue,
    "hljs-section": blue,
    "hljs-name": blue,
    "hljs-selector-tag": blue,
    "hljs-selector-class": magenta,
    "hljs-selector-id": magenta,
    "hljs-selector-pseudo": magenta,
    "hljs-template-variable": magenta,
    "hljs-variable": magenta,
    "hljs-strong": bold,
    "hljs-emphasis": italic,
  }[classname] ?? ((text: string) => text))(content)
}
