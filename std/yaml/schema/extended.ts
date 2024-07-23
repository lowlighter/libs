import { EXTENDED_SCHEMA as _variable_EXTENDED_SCHEMA } from "jsr:@std/yaml@0.224.3/schema/extended"
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

import { extended as _variable_extended } from "jsr:@std/yaml@0.224.3/schema/extended"
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
 *
 * @deprecated This will be removed in 1.0.0. Use {@link EXTENDED_SCHEMA} instead.
 */
const extended = _variable_extended
export { extended }
