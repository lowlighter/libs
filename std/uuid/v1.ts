import { validate as _function_validate } from "jsr:@std/uuid@1.0.4/v1"
/**
 * Determines whether a string is a valid
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.1 | UUIDv1}.
 *
 * @param id UUID value.
 *
 * @return `true` if the string is a valid UUIDv1, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid/v1";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate("ea71fc60-a713-11ee-af61-8349da24f689"));
 * assertFalse(validate("fac8c1e0-ad1a-4204-a0d0-8126ae84495d"));
 * ```
 */
const validate = _function_validate as typeof _function_validate
export { validate }

import type { GenerateOptions as _interface_GenerateOptions } from "jsr:@std/uuid@1.0.4/v1"
/**
 * Options for {@linkcode generate}.
 */
interface GenerateOptions extends _interface_GenerateOptions {}
export type { GenerateOptions }

import { generate as _function_generate } from "jsr:@std/uuid@1.0.4/v1"
/**
 * Generates a
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.1 | UUIDv1}.
 *
 * @param options Can use RFC time sequence values as overwrites.
 * @param buf Can allow the UUID to be written in byte-form starting at the offset.
 * @param offset Index to start writing on the UUID bytes in buffer.
 *
 * @return Returns a UUIDv1 string or an array of 16 bytes.
 *
 * @example Usage
 * ```ts
 * import { generate, validate } from "@std/uuid/v1";
 * import { assert } from "@std/assert";
 *
 * const options = {
 *   node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
 *   clockseq: 0x1234,
 *   msecs: new Date("2011-11-01").getTime(),
 *   nsecs: 5678,
 * };
 *
 * const uuid = generate(options);
 * assert(validate(uuid as string));
 * ```
 */
const generate = _function_generate as typeof _function_generate
export { generate }
