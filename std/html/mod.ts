/**
 * Functions for HTML tasks such as escaping or unescaping HTML entities.
 *
 * ```ts
 * import { unescape } from "@std/html/entities";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unescape("&lt;&gt;&#39;&amp;AA"), "<>'&AA");
 * assertEquals(unescape("&thorn;&eth;"), "&thorn;&eth;");
 * ```
 *
 * @module
 */
import type { EntityList as _typeAlias_EntityList } from "jsr:@std/html@1.0.1"
/**
 * Object structure for a list of HTML entities.
 */
type EntityList = _typeAlias_EntityList
export type { EntityList }

import { escape as _function_escape } from "jsr:@std/html@1.0.1"
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
const escape = _function_escape
export { escape }

import type { UnescapeOptions as _typeAlias_UnescapeOptions } from "jsr:@std/html@1.0.1"
/**
 * Options for {@linkcode unescape}.
 */
type UnescapeOptions = _typeAlias_UnescapeOptions
export type { UnescapeOptions }

import { unescape as _function_unescape } from "jsr:@std/html@1.0.1"
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
const unescape = _function_unescape
export { unescape }

import { isValidCustomElementName as _function_isValidCustomElementName } from "jsr:@std/html@1.0.1"
/**
 * Returns whether the given string is a valid custom element name, as per the
 * requirements defined in
 * {@link https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 *
 * Using a valid custom element name
 *
 * ```ts
 * import { isValidCustomElementName } from "@std/html/is-valid-custom-element-name";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(isValidCustomElementName("custom-element"), true);
 * assertEquals(isValidCustomElementName("font-face"), false);
 * assertEquals(isValidCustomElementName("custom-element@"), false);
 * ```
 *
 * @param elementName The element name to be validate
 * @return `true` if the element name is valid, `false` otherwise.
 */
const isValidCustomElementName = _function_isValidCustomElementName
export { isValidCustomElementName }
