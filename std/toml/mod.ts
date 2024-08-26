/**
 * {@linkcode parse} and {@linkcode stringify} for handling
 * {@link https://toml.io | TOML} encoded data.
 *
 * Be sure to read the supported types as not every spec is supported at the
 * moment and the handling in TypeScript side is a bit different.
 *
 * ## Supported types and handling
 *
 * - [x] [Keys](https://toml.io/en/latest#keys)
 * - [ ] [String](https://toml.io/en/latest#string)
 * - [x] [Multiline String](https://toml.io/en/latest#string)
 * - [x] [Literal String](https://toml.io/en/latest#string)
 * - [ ] [Integer](https://toml.io/en/latest#integer)
 * - [x] [Float](https://toml.io/en/latest#float)
 * - [x] [Boolean](https://toml.io/en/latest#boolean)
 * - [x] [Offset Date-time](https://toml.io/en/latest#offset-date-time)
 * - [x] [Local Date-time](https://toml.io/en/latest#local-date-time)
 * - [x] [Local Date](https://toml.io/en/latest#local-date)
 * - [ ] [Local Time](https://toml.io/en/latest#local-time)
 * - [x] [Table](https://toml.io/en/latest#table)
 * - [x] [Inline Table](https://toml.io/en/latest#inline-table)
 * - [ ] [Array of Tables](https://toml.io/en/latest#array-of-tables)
 *
 * _Supported with warnings see [Warning](#Warning)._
 *
 * ### Warning
 *
 * #### String
 *
 * Due to the spec, there is no flag to detect regex properly in a TOML
 * declaration. So the regex is stored as string.
 *
 * #### Integer
 *
 * For **Binary** / **Octal** / **Hexadecimal** numbers, they are stored as string
 * to be not interpreted as Decimal.
 *
 * #### Local Time
 *
 * Because local time does not exist in JavaScript, the local time is stored as a
 * string.
 *
 * #### Array of Tables
 *
 * At the moment only simple declarations like below are supported:
 *
 * ```toml
 * [[bin]]
 * name = "deno"
 * path = "cli/main.rs"
 *
 * [[bin]]
 * name = "deno_core"
 * path = "src/foo.rs"
 *
 * [[nib]]
 * name = "node"
 * path = "not_found"
 * ```
 *
 * will output:
 *
 * ```json
 * {
 *   "bin": [
 *     { "name": "deno", "path": "cli/main.rs" },
 *     { "name": "deno_core", "path": "src/foo.rs" }
 *   ],
 *   "nib": [{ "name": "node", "path": "not_found" }]
 * }
 * ```
 *
 * ```ts
 * import { parse, stringify } from "@std/toml";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = {
 *   bin: [
 *     { name: "deno", path: "cli/main.rs" },
 *     { name: "deno_core", path: "src/foo.rs" },
 *   ],
 *   nib: [{ name: "node", path: "not_found" }],
 * };
 *
 * const tomlString = stringify(obj);
 * assertEquals(tomlString, `
 * [[bin]]
 * name = "deno"
 * path = "cli/main.rs"
 *
 * [[bin]]
 * name = "deno_core"
 * path = "src/foo.rs"
 *
 * [[nib]]
 * name = "node"
 * path = "not_found"
 * `);
 *
 * const tomlObject = parse(tomlString);
 * assertEquals(tomlObject, obj);
 * ```
 *
 * @module
 */
import type { StringifyOptions as _interface_StringifyOptions } from "jsr:@std/toml@1.0.0"
/**
 * Options for {@linkcode stringify}.
 */
interface StringifyOptions extends _interface_StringifyOptions {}
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/toml@1.0.0"
/**
 * Converts an object to a {@link https://toml.io | TOML} string.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/toml/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = {
 *   title: "TOML Example",
 *   owner: {
 *     name: "Bob",
 *     bio: "Bob is a cool guy",
 *  }
 * };
 * const tomlString = stringify(obj);
 * assertEquals(tomlString, `title = "TOML Example"\n\n[owner]\nname = "Bob"\nbio = "Bob is a cool guy"\n`);
 * ```
 * @param obj Source object
 * @param options Options for stringifying.
 * @return TOML string
 */
const stringify = _function_stringify as typeof _function_stringify
export { stringify }

import { parse as _function_parse } from "jsr:@std/toml@1.0.0"
/**
 * Parses a {@link https://toml.io | TOML} string into an object.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/toml/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const tomlString = `title = "TOML Example"
 * [owner]
 * name = "Alice"
 * bio = "Alice is a programmer."`;
 *
 * const obj = parse(tomlString);
 * assertEquals(obj, { title: "TOML Example", owner: { name: "Alice", bio: "Alice is a programmer." } });
 * ```
 * @param tomlString TOML string to be parsed.
 * @return The parsed JS object.
 */
const parse = _function_parse as typeof _function_parse
export { parse }
