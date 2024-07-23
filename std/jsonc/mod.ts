/**
 * Provides tools for working with JSONC (JSON with comments). Currently, this
 * module only provides a means of parsing JSONC. JSONC serialization is not
 * yet supported.
 *
 * ```ts
 * import { parse } from "@std/jsonc";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(parse('{"foo": "bar", } // comment'), { foo: "bar" });
 *
 * assertEquals(parse('{"foo": "bar", } /* comment *\/'), { foo: "bar" });
 *
 * assertEquals(
 *   parse('{"foo": "bar" } // comment', { allowTrailingComma: false }),
 *   { foo: "bar" }
 * );
 * ```
 *
 * @module
 */
import type { JsonValue as _typeAlias_JsonValue } from "jsr:@std/jsonc@0.224.3"
/**
 * The type of the result of parsing JSON.
 */
type JsonValue = _typeAlias_JsonValue
export type { JsonValue }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/jsonc@0.224.3"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/jsonc@0.224.3"
/**
 * Converts a JSON with Comments (JSONC) string into an object.
 * If a syntax error is found, throw a {@linkcode SyntaxError}.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/jsonc";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(parse('{"foo": "bar"}'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar", }'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar", } /* comment *\/'), { foo: "bar" });
 * assertEquals(parse('{"foo": "bar" } // comment', { allowTrailingComma: false }), { foo: "bar" });
 * ```
 *
 * @param text A valid JSONC string.
 * @return The parsed JsonValue from the JSONC string.
 */
const parse = _function_parse
export { parse }
