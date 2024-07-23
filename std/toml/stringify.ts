import type { StringifyOptions as _interface_StringifyOptions } from "jsr:@std/toml@1.0.0/stringify"
/**
 * Options for {@linkcode stringify}.
 */
interface StringifyOptions extends _interface_StringifyOptions {}
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/toml@1.0.0/stringify"
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
const stringify = _function_stringify
export { stringify }
