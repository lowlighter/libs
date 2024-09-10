import { validate as _function_validate } from "jsr:@std/uuid@1.0.3/v7"
/**
 * Determines whether a string is a valid
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.7 | UUIDv7}.
 *
 * @experimental
 * @param id UUID value.
 *
 * @return `true` if the string is a valid UUIDv7, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid/v7";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate("017f22e2-79b0-7cc3-98c4-dc0c0c07398f"));
 * assertFalse(validate("fac8c1e0-ad1a-4204-a0d0-8126ae84495d"));
 * ```
 */
const validate = _function_validate as typeof _function_validate
export { validate }

import { generate as _function_generate } from "jsr:@std/uuid@1.0.3/v7"
/**
 * Generates a {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.7 | UUIDv7}.
 *
 * @experimental
 * @throws If the timestamp is not a non-negative integer.
 *
 * @param timestamp Unix Epoch timestamp in milliseconds.
 *
 * @return Returns a UUIDv7 string
 *
 * @example Usage
 * ```ts
 * import { generate, validate } from "@std/uuid/v7";
 * import { assert } from "@std/assert";
 *
 * const uuid = generate();
 * assert(validate(uuid));
 * ```
 */
const generate = _function_generate as typeof _function_generate
export { generate }

import { extractTimestamp as _function_extractTimestamp } from "jsr:@std/uuid@1.0.3/v7"
/**
 * Extracts the timestamp from a UUIDv7.
 *
 * @experimental
 * @param uuid UUIDv7 string to extract the timestamp from.
 * @return Returns the timestamp in milliseconds.
 *
 * @throws If the UUID is not a valid UUIDv7.
 *
 * @example Usage
 * ```ts
 * import { extractTimestamp } from "@std/uuid/v7";
 * import { assertEquals } from "@std/assert";
 *
 * const uuid = "017f22e2-79b0-7cc3-98c4-dc0c0c07398f";
 * const timestamp = extractTimestamp(uuid);
 * assertEquals(timestamp, 1645557742000);
 * ```
 */
const extractTimestamp = _function_extractTimestamp as typeof _function_extractTimestamp
export { extractTimestamp }
