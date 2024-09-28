// Imports
import hljs from "npm:highlight.js@11/lib/core"
import typescript from "npm:highlight.js@11/lib/languages/typescript"
import { bgBlack, bgWhite, bgYellow, black, blue, cyan, gray, green, stripAnsiCode, underline, yellow } from "@std/fmt/colors"
import { unescape } from "@std/html/entities"
hljs.registerLanguage("typescript", typescript)

/**
 * Syntax highlights code strings within backticks with ANSI codes.
 *
 * @example
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

/** Process rendered highlight.js html back to cli formatted highlighing. */
function process(html: string) {
  const regex = /<span[^>]*class="(?<classname>[^"]*)"[^>]*>(?<content>.*?)<\/span>/gs
  let match
  while ((match = regex.exec(html)) !== null) {
    const [captured] = match
    const { classname, content } = match.groups!
    if (!content.includes("<span")) {
      return process(html.replace(captured, color(content, classname)))
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
    "hljs-literal": yellow,
    "hljs-number": yellow,
  }[classname] ?? ((text: string) => text))(content)
}
