import type { DumpOptions as _typeAlias_DumpOptions } from "jsr:@std/yaml@0.224.3/stringify"
/**
 * The option for strinigfy.
 */
type DumpOptions = _typeAlias_DumpOptions
export type { DumpOptions }

import { stringify as _function_stringify } from "jsr:@std/yaml@0.224.3/stringify"
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
