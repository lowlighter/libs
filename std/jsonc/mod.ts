/**
 * Provides tools for working with
 * {@link https://code.visualstudio.com/docs/languages/json#_json-with-comments | JSONC}
 * (JSON with comments).
 *
 * Currently, this module only provides a means of parsing JSONC. JSONC
 * serialization is not yet supported.
 *
 * ```ts
 * import { parse } from "@std/jsonc";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(parse('{"foo": "bar", } // comment'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar", } /* comment *\/'), { foo: "bar" });
 * ```
 *
 * @module
 */
import type { JsonValue as _typeAlias_JsonValue } from "jsr:@std/jsonc@1.0.0"
/**
 * The type of the result of parsing JSON.
 */
type JsonValue = _typeAlias_JsonValue
export type { JsonValue }

import { parse as _function_parse } from "jsr:@std/jsonc@1.0.0"
/**
 * Converts a JSON with Comments (JSONC) string into an object.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/jsonc";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(parse('{"foo": "bar"}'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar", }'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar", } /* comment *\/'), { foo: "bar" });
 * ```
 *
 * @throws If the JSONC string is invalid.
 * @param text A valid JSONC string.
 * @return The parsed JsonValue from the JSONC string.
 */
const parse = _function_parse
export { parse }
