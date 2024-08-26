import { isNil as _function_isNil } from "jsr:@std/uuid@1.0.1/common"
/**
 * Determines whether the UUID is the
 * {@link https://www.rfc-editor.org/rfc/rfc4122#section-4.1.7 | nil UUID}.
 *
 * @param id UUID value.
 *
 * @return `true` if the UUID is the nil UUID, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { isNil } from "@std/uuid";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isNil("00000000-0000-0000-0000-000000000000"));
 * assertFalse(isNil(crypto.randomUUID()));
 * ```
 */
const isNil = _function_isNil as typeof _function_isNil
export { isNil }

import { validate as _function_validate } from "jsr:@std/uuid@1.0.1/common"
/**
 * Determines whether a string is a valid UUID.
 *
 * @param uuid UUID value.
 *
 * @return `true` if the string is a valid UUID, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b"));
 * assertFalse(validate("not a UUID"));
 * ```
 */
const validate = _function_validate as typeof _function_validate
export { validate }

import { version as _function_version } from "jsr:@std/uuid@1.0.1/common"
/**
 * Detect RFC version of a UUID.
 *
 * @param uuid UUID value.
 *
 * @return The RFC version of the UUID.
 *
 * @example Usage
 * ```ts
 * import { version } from "@std/uuid";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(version("d9428888-122b-11e1-b85c-61cd3cbb3210"), 1);
 * assertEquals(version("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b"), 4);
 * ```
 */
const version = _function_version as typeof _function_version
export { version }
