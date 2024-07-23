/**
 * {@linkcode parse} and {@linkcode stringify} for handling
 * {@link https://yaml.org/ | YAML} encoded data.
 *
 * Ported from
 * {@link https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da | js-yaml v3.13.1}.
 *
 * If your YAML contains multiple documents in it, you can use {@linkcode parseAll} for
 * handling it.
 *
 * To handle `regexp`, and `undefined` types, use {@linkcode EXTENDED_SCHEMA}.
 * You can also use custom types by extending schemas.
 *
 * ## :warning: Limitations
 * - `binary` type is currently not stable.
 *
 * For further examples see https://github.com/nodeca/js-yaml/tree/master/examples.
 * @example ```ts
 * import {
 *   parse,
 *   stringify,
 * } from "@std/yaml";
 *
 * const data = parse(`
 * foo: bar
 * baz:
 *   - qux
 *   - quux
 * `);
 * console.log(data);
 * // => { foo: "bar", baz: [ "qux", "quux" ] }
 *
 * const yaml = stringify({ foo: "bar", baz: ["qux", "quux"] });
 * console.log(yaml);
 * // =>
 * // foo: bar
 * // baz:
 * //   - qux
 * //   - quux
 * ```
 *
 * @module
 */
import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/yaml@0.224.3"
/**
 * Options for parsing YAML.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/yaml@0.224.3"
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

import { parseAll as _function_parseAll } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
const parseAll = _function_parseAll
export { parseAll }

import type { DumpOptions as _typeAlias_DumpOptions } from "jsr:@std/yaml@0.224.3"
/**
 * The option for strinigfy.
 */
type DumpOptions = _typeAlias_DumpOptions
export type { DumpOptions }

import { stringify as _function_stringify } from "jsr:@std/yaml@0.224.3"
/**
 * Serializes `data` as a YAML document.
 *
 * You can disable exceptions by setting the skipInvalid option to true.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/yaml/stringify";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const data = { id: 1, name: "Alice" };
 * const yaml = stringify(data);
 *
 * assertEquals(yaml, "id: 1\nname: Alice\n");
 * ```
 *
 * @param data The data to serialize.
 * @param options The options for serialization.
 * @return A YAML string.
 */
const stringify = _function_stringify
export { stringify }

import type { KindType as _typeAlias_KindType } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
type KindType = _typeAlias_KindType
export type { KindType }

import type { StyleVariant as _typeAlias_StyleVariant } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
type StyleVariant = _typeAlias_StyleVariant
export type { StyleVariant }

import type { RepresentFn as _typeAlias_RepresentFn } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
type RepresentFn = _typeAlias_RepresentFn
export type { RepresentFn }

import { Type as _class_Type } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
class Type extends _class_Type {}
export { Type }

import { CORE_SCHEMA as _variable_CORE_SCHEMA } from "jsr:@std/yaml@0.224.3"
/**
 * Standard YAML's core schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2804923}
 */
const CORE_SCHEMA = _variable_CORE_SCHEMA
export { CORE_SCHEMA }

import { DEFAULT_SCHEMA as _variable_DEFAULT_SCHEMA } from "jsr:@std/yaml@0.224.3"
/**
 * Default YAML schema. It is not described in the YAML specification.
 */
const DEFAULT_SCHEMA = _variable_DEFAULT_SCHEMA
export { DEFAULT_SCHEMA }

import { EXTENDED_SCHEMA as _variable_EXTENDED_SCHEMA } from "jsr:@std/yaml@0.224.3"
/**
 * *
 * Extends JS-YAML default schema with additional JavaScript types
 * It is not described in the YAML specification.
 * Functions are no longer supported for security reasons.
 *
 * @example ```ts
 * import {
 *   EXTENDED_SCHEMA,
 *   parse,
 * } from "@std/yaml";
 *
 * const data = parse(
 *   `
 *   regexp:
 *     simple: !!js/regexp foobar
 *     modifiers: !!js/regexp /foobar/mi
 *   undefined: !!js/undefined ~
 * # Disabled, see: https://github.com/denoland/deno_std/pull/1275
 * #  function: !!js/function >
 * #    function foobar() {
 * #      return 'hello world!';
 * #    }
 * `,
 *   { schema: EXTENDED_SCHEMA },
 * );
 * ```
 */
const EXTENDED_SCHEMA = _variable_EXTENDED_SCHEMA
export { EXTENDED_SCHEMA }

import { FAILSAFE_SCHEMA as _variable_FAILSAFE_SCHEMA } from "jsr:@std/yaml@0.224.3"
/**
 * Standard YAML's failsafe schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2802346}
 */
const FAILSAFE_SCHEMA = _variable_FAILSAFE_SCHEMA
export { FAILSAFE_SCHEMA }

import { JSON_SCHEMA as _variable_JSON_SCHEMA } from "jsr:@std/yaml@0.224.3"
/**
 * Standard YAML's JSON schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2803231}
 *
 * @deprecated This will be removed in 1.0.0. Use {@link JSON_SCHEMA} instead.
 */
const JSON_SCHEMA = _variable_JSON_SCHEMA
export { JSON_SCHEMA }

import { replaceSchemaNameWithSchemaClass as _function_replaceSchemaNameWithSchemaClass } from "jsr:@std/yaml@0.224.3"
/** UNDOCUMENTED */
const replaceSchemaNameWithSchemaClass = _function_replaceSchemaNameWithSchemaClass
export { replaceSchemaNameWithSchemaClass }
