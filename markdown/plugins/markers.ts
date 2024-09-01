// Imports
import type { Plugin } from "../renderer.ts"
import remarkFlexibleMarkers from "remark-flexible-markers"

/** Marker attributes */
const dictionary = Object.fromEntries([..."abcdefghijklmnopqrstuvwxyz"].map((letter) => [letter, letter]))

/**
 * Add support for markers.
 *
 * @example
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
    return processor.use(remarkFlexibleMarkers, { dictionary, markerClassName: () => [], markerProperties: (letter) => (letter ? { [letter]: true } : {}) })
  },
} as Plugin
