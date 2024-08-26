import type { SchemaType as _typeAlias_SchemaType } from "jsr:@std/yaml@1.0.3/parse"
/**
 * Name of the schema to use.
 *
 * > [!NOTE]
 * > It is recommended to use the schema that is most appropriate for your use
 * > case. Doing so will avoid any unnecessary processing and benefit
 * > performance.
 *
 * Options include:
 * - `failsafe`: supports generic mappings, generic sequences and generic
 * strings.
 * - `json`: extends `failsafe` schema by also supporting nulls, booleans,
 * integers and floats.
 * - `core`: functionally the same as `json` schema.
 * - `default`: extends `core` schema by also supporting binary, omap, pairs and
 * set types.
 * - `extended`: extends `default` schema by also supporting regular
 * expressions and undefined values.
 *
 * See
 * {@link https://yaml.org/spec/1.2.2/#chapter-10-recommended-schemas | YAML 1.2 spec}
 * for more details on the `failsafe`, `json` and `core` schemas.
 */
type SchemaType = _typeAlias_SchemaType
export type { SchemaType }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/yaml@1.0.3/parse"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/yaml@1.0.3/parse"
/**
 * Parse and return a YAML string as a parsed YAML document object.
 *
 * Note: This does not support functions. Untrusted data is safe to parse.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/yaml/parse";
 * import { assertEquals } from "@std/assert";
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
const parse = _function_parse as typeof _function_parse
export { parse }

import { parseAll as _function_parseAll } from "jsr:@std/yaml@1.0.3/parse"
/**
 * Same as {@linkcode parse}, but understands multi-document YAML sources, and
 * returns multiple parsed YAML document objects.
 *
 * @example Usage
 * ```ts
 * import { parseAll } from "@std/yaml/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const data = parseAll(`
 * ---
 * id: 1
 * name: Alice
 * ---
 * id: 2
 * name: Bob
 * ---
 * id: 3
 * name: Eve
 * `);
 * assertEquals(data, [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" }, { id: 3, name: "Eve" }]);
 * ```
 *
 * @param content YAML string to parse.
 * @param options Parsing options.
 * @return Array of parsed documents.
 */
const parseAll = _function_parseAll as typeof _function_parseAll
export { parseAll }
