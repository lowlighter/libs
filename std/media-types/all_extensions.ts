import { allExtensions as _function_allExtensions } from "jsr:@std/media-types@1.0.2/all-extensions"
/**
 * Returns all the extensions known to be associated with the media type `type`, or
 * `undefined` if no extensions are found.
 *
 * Extensions are returned without a leading `.`.
 *
 * @param type The media type to get the extensions for.
 *
 * @return The extensions for the given media type, or `undefined` if no
 * extensions are found.
 *
 * @example Usage
 * ```ts
 * import { allExtensions } from "@std/media-types/all-extensions";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(allExtensions("application/json"), ["json", "map"]);
 * assertEquals(allExtensions("text/html; charset=UTF-8"), ["html", "htm", "shtml"]);
 * assertEquals(allExtensions("application/foo"), undefined);
 * ```
 */
const allExtensions = _function_allExtensions
export { allExtensions }
