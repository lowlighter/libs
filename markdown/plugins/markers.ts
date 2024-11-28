// Imports
import type { Plugin } from "../renderer.ts"
import remarkFlexibleMarkers from "remark-flexible-markers"

/** Marker attributes */
const dictionary = Object.fromEntries([..."abcdefghijklmnopqrstuvwxyz"].map((letter) => [letter, letter]))

/**
 * Add support for markers.
 *
 * ```md
 * ==foo==
 * =r=bar=
 * ```
 * ```html
 * <p><mark>foo</mark></p>
 * <p><mark r>bar</mark></p>
 * ```
 */
export default {
  remark(processor) {
    // deno-lint-ignore no-explicit-any
    return processor.use(remarkFlexibleMarkers as any, { dictionary, markerClassName: () => [], markerProperties: (letter:string) => (letter ? { [letter]: true } : {}) } as any)
  },
} as Plugin
