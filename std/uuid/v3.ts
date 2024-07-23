import { validate as _function_validate } from "jsr:@std/uuid@1.0.0/v3"
/**
 * Determines whether a string is a valid
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.3 | UUIDv3}.
 *
 * @param id UUID value.
 *
 * @return `true` if the string is a valid UUIDv3, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid/v3";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate("22fe6191-c161-3d86-a432-a81f343eda08"));
 * assertFalse(validate("this-is-not-a-uuid"));
 * ```
 */
const validate = _function_validate
export { validate }

import { generate as _function_generate } from "jsr:@std/uuid@1.0.0/v3"
/**
 * Generates a
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.3 | UUIDv3}.
 *
 * @param namespace The namespace to use, encoded as a UUID.
 * @param data The data to hash to calculate the MD5 digest for the UUID.
 *
 * @return A UUIDv3 string.
 *
 * @throws If the namespace is not a valid UUID.
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_URL } from "@std/uuid/constants";
 * import { generate, validate } from "@std/uuid/v3";
 * import { assert } from "@std/assert";
 *
 * const data = new TextEncoder().encode("python.org");
 * const uuid = await generate(NAMESPACE_URL, data);
 *
 * assert(validate(uuid));
 * ```
 */
const generate = _function_generate
export { generate }
