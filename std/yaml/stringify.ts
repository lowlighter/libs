import type { SchemaType as _typeAlias_SchemaType } from "jsr:@std/yaml@1.0.5/stringify"
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

import type { StyleVariant as _typeAlias_StyleVariant } from "jsr:@std/yaml@1.0.5/stringify"
/**
 * The style variation for `styles` option of {@linkcode stringify}
 */
type StyleVariant = _typeAlias_StyleVariant
export type { StyleVariant }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/yaml@1.0.5/stringify"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/yaml@1.0.5/stringify"
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
const stringify = _function_stringify as typeof _function_stringify
export { stringify }
