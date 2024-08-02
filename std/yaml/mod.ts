/**
 * {@linkcode parse} and {@linkcode stringify} for handling
 * {@link https://yaml.org/ | YAML} encoded data.
 *
 * Ported from
 * {@link https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da | js-yaml v3.13.1}.
 *
 * Use {@linkcode parseAll} for parsing multiple documents in a single YAML
 * string.
 *
 * This package generally supports
 * {@link https://yaml.org/spec/1.2.2/ | YAML 1.2.x} (latest) and some
 * {@link https://yaml.org/spec/1.1/current.html | YAML 1.1} features that are
 * commonly used in the wild.
 *
 * Supported YAML 1.1 features include:
 * - {@link https://yaml.org/type/merge.html | Merge} type (`<<` symbol)
 *
 * Unsupported YAML 1.1 features include:
 * - Yes, No, On, Off literals for bool type
 * - Sexagesimal numbers (e.g. `3:25:45`)
 *
 * ```ts
 * import { parse, stringify } from "@std/yaml";
 * import { assertEquals } from "@std/assert";
 *
 * const data = parse(`
 * foo: bar
 * baz:
 *   - qux
 *   - quux
 * `);
 * assertEquals(data, { foo: "bar", baz: [ "qux", "quux" ] });
 *
 * const yaml = stringify({ foo: "bar", baz: ["qux", "quux"] });
 * assertEquals(yaml, `foo: bar
 * baz:
 *   - qux
 *   - quux
 * `);
 * ```
 *
 * ## Limitations
 * - `binary` type is currently not stable.
 *
 * @module
 */
import type { SchemaType as _typeAlias_SchemaType } from "jsr:@std/yaml@1.0.1"
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

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/yaml@1.0.1"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/yaml@1.0.1"
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
const parse = _function_parse
export { parse }

import { parseAll as _function_parseAll } from "jsr:@std/yaml@1.0.1"
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
const parseAll = _function_parseAll
export { parseAll }

import type { StyleVariant as _typeAlias_StyleVariant } from "jsr:@std/yaml@1.0.1"
/**
 * The style variation for `styles` option of {@linkcode stringify}
 */
type StyleVariant = _typeAlias_StyleVariant
export type { StyleVariant }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/yaml@1.0.1"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/yaml@1.0.1"
/**
 * Converts a JavaScript object or value to a YAML document string.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/yaml/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const data = { id: 1, name: "Alice" };
 * const yaml = stringify(data);
 *
 * assertEquals(yaml, "id: 1\nname: Alice\n");
 * ```
 *
 * @throws If `data` contains invalid types.
 * @param data The data to serialize.
 * @param options The options for serialization.
 * @return A YAML string.
 */
const stringify = _function_stringify
export { stringify }
