// Imports
import { Renderer } from "@libs/markdown"
import gfm from "../plugins/gfm.ts"
import { create as sanitize} from "../plugins/sanitize.ts"
import highlighting from "../plugins/highlighting.ts"

/** Renderer instance. */
const renderer = new Renderer({
    plugins: [
      gfm,
      sanitize({
        tagNames: [
          // Headers
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          // Text
          "p",
          "strong",
          "em",
          "del",
          "sup",
          "sub",
          // Blockquotes
          "blockquote",
          // Code
          "pre",
          "code",
          "kbd",
          // Links
          "a",
          // Images
          "img",
          // Tables
          "table",
          "thead",
          "tbody",
          "tfoot",
          "tr",
          "th",
          "td",
          // Lists
          "ul",
          "ol",
          "li",
          "input",
          // Horizontal rules
          "hr",
          // Line breaks
          "br",
        ],
        strip: ["script"],
        required: {
          input: { disabled: true, type: "checkbox" },
        },
        ancestors: {
          tbody: ["table"],
          td: ["table"],
          th: ["table"],
          thead: ["table"],
          tfoot: ["table"],
          tr: ["table"],
        },
        attributes: {
          a: ["href"],
          code: [["className", /^language-./]],
          img: ["src", "alt"],
          input: [["disabled", true], ["type", "checkbox"], "checked"],
          li: [["className", "task-list-item"]],
          ol: [["className", "contains-task-list"]],
          ul: [["className", "contains-task-list"]],
          "*": ["align", "alt", "height", "width", "title", "width"],
        },
        protocols: {
          href: ["http", "https"],
          src: ["http", "https", "data"],
        },
      }),
      highlighting,
    ],
  })

/**
 * Renders a markdown expression suitable for SVG (sanitized with a subset of tags and attributes).
 */
export function markdown(text: string): Promise<string> {
  return renderer.render(text)
}
