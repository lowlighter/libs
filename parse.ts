/**
 * This module contains a parser for XML data.
 * @module
 */
//Imports
import { Parser } from "./utils/parser.ts"
import { Stream } from "./utils/stream.ts"
import { Streamable } from "./utils/streamable.ts"
import type { document, Flux, ParserOptions } from "./utils/types.ts"

/**
 * XML parser
 *
 * Parse a `string` or a {@link Flux} stream into a {@link document}.
 *
 * Parsed attributes will be prefixed with `@`, while comments will be stored in `#comment` property and content in `#text`.
 * If a node does not possess any attribute or comments, then it will be flattened into its text content for convenience.
 *
 * {@link ParserOptions} can be used to customize the parser behavior.
 *
 * @example
 * ```ts
 * import { parse } from "./parse.ts"
 *
 * console.log(parse(
 * `
 *   <root>
 *     <!-- This is a comment -->
 *     <text>hello</text>
 *     <array>world</array>
 *     <array>monde</array>
 *     <array>世界</array>
 *     <array>🌏</array>
 *     <number>42</number>
 *     <boolean>true</boolean>
 *     <complex attribute="value">content</complex>
 *   </root>
 * `,
 *   { reviveNumbers: true, reviveBooleans: true },
 * ))
 * ```
 */
export function parse(content: string | Flux, options?: ParserOptions): document {
  if (typeof content === "string") {
    content = new Streamable(content)
  }
  return new Parser(new Stream(content), options).parse() as document
}
