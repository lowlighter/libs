import { CORE_SCHEMA as _variable_CORE_SCHEMA } from "jsr:@std/yaml@0.224.3/schema"
/**
 * Standard YAML's core schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2804923}
 */
const CORE_SCHEMA = _variable_CORE_SCHEMA
export { CORE_SCHEMA }

import { DEFAULT_SCHEMA as _variable_DEFAULT_SCHEMA } from "jsr:@std/yaml@0.224.3/schema"
/**
 * Default YAML schema. It is not described in the YAML specification.
 */
const DEFAULT_SCHEMA = _variable_DEFAULT_SCHEMA
export { DEFAULT_SCHEMA }

import { EXTENDED_SCHEMA as _variable_EXTENDED_SCHEMA } from "jsr:@std/yaml@0.224.3/schema"
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

import { FAILSAFE_SCHEMA as _variable_FAILSAFE_SCHEMA } from "jsr:@std/yaml@0.224.3/schema"
/**
 * Standard YAML's failsafe schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2802346}
 */
const FAILSAFE_SCHEMA = _variable_FAILSAFE_SCHEMA
export { FAILSAFE_SCHEMA }

import { JSON_SCHEMA as _variable_JSON_SCHEMA } from "jsr:@std/yaml@0.224.3/schema"
/**
 * Standard YAML's JSON schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2803231}
 *
 * @deprecated This will be removed in 1.0.0. Use {@link JSON_SCHEMA} instead.
 */
const JSON_SCHEMA = _variable_JSON_SCHEMA
export { JSON_SCHEMA }

import { replaceSchemaNameWithSchemaClass as _function_replaceSchemaNameWithSchemaClass } from "jsr:@std/yaml@0.224.3/schema"
/** UNDOCUMENTED */
const replaceSchemaNameWithSchemaClass = _function_replaceSchemaNameWithSchemaClass
export { replaceSchemaNameWithSchemaClass }
