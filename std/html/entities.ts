import type { EntityList as _typeAlias_EntityList } from "jsr:@std/html@1.0.3/entities"
/**
 * Object structure for a list of HTML entities.
 */
type EntityList = _typeAlias_EntityList
export type { EntityList }

import { escape as _function_escape } from "jsr:@std/html@1.0.3/entities"
/**
 * Escapes text for safe interpolation into HTML text content and quoted attributes.
 *
 * @example Usage
 * ```ts
 * import { escape } from "@std/html/entities";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(escape("<>'&AA"), "&lt;&gt;&#39;&amp;AA");
 *
 * // Characters that don't need to be escaped will be left alone,
 * // even if named HTML entities exist for them.
 * assertEquals(escape("þð"), "þð");
 * ```
 *
 * @param str The string to escape.
 * @return The escaped string.
 */
const escape = _function_escape as typeof _function_escape
export { escape }

import type { UnescapeOptions as _typeAlias_UnescapeOptions } from "jsr:@std/html@1.0.3/entities"
/**
 * Options for {@linkcode unescape}.
 */
type UnescapeOptions = _typeAlias_UnescapeOptions
export type { UnescapeOptions }

import { unescape as _function_unescape } from "jsr:@std/html@1.0.3/entities"
/**
 * Unescapes HTML entities in text.
 *
 * Default options only handle `&<>'"` and numeric entities.
 *
 * @example Basic usage
 * ```ts
 * import { unescape } from "@std/html/entities";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unescape("&lt;&gt;&#39;&amp;AA"), "<>'&AA");
 * assertEquals(unescape("&thorn;&eth;"), "&thorn;&eth;");
 * ```
 *
 * @example Using a custom entity list
 *
 * This uses the full named entity list from the HTML spec (~47K un-minified)
 *
 * ```ts
 * import { unescape } from "@std/html/entities";
 * import entityList from "@std/html/named-entity-list.json" with { type: "json" };
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unescape("&lt;&gt;&#39;&amp;AA", { entityList }), "<>'&AA");
 * ```
 *
 * @param str The string to unescape.
 * @param options Options for unescaping.
 * @return The unescaped string.
 */
const unescape = _function_unescape as typeof _function_unescape
export { unescape }
