import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/yaml@0.224.3/parse"
/**
 * Options for parsing YAML.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/yaml@0.224.3/parse"
/**
 * Parse `content` as single YAML document, and return it.
 *
 * This function does not support regexps, functions, and undefined by default.
 * This method is safe for parsing untrusted data.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/yaml/parse";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const data = parse(`
 * id: 1
 * name: Alice
 * `);
 *
 * assertEquals(data, { id: 1, name: "Alice" });
 * ```
 *
 * @throws Throws error on invalid YAML.
 * @param content YAML string to parse.
 * @param options Parsing options.
 * @return Parsed document.
 */
const parse = _function_parse
export { parse }

import { parseAll as _function_parseAll } from "jsr:@std/yaml@0.224.3/parse"
/** UNDOCUMENTED */
const parseAll = _function_parseAll
export { parseAll }
