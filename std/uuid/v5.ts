import { validate as _function_validate } from "jsr:@std/uuid@1.0.0/v5"
/**
 * Determines whether a string is a valid
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.5 | UUIDv5}.
 *
 * @param id UUID value.
 *
 * @return `true` if the string is a valid UUIDv5, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid/v5";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate("7af94e2b-4dd9-50f0-9c9a-8a48519bdef0"));
 * assertFalse(validate(crypto.randomUUID()));
 * ```
 */
const validate = _function_validate
export { validate }

import { generate as _function_generate } from "jsr:@std/uuid@1.0.0/v5"
/**
 * Generates a
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.5 | UUIDv5}.
 *
 * @param namespace The namespace to use, encoded as a UUID.
 * @param data The data to hash to calculate the SHA-1 digest for the UUID.
 *
 * @return A UUIDv5 string.
 *
 * @throws If the namespace is not a valid UUID.
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_URL } from "@std/uuid/constants";
 * import { generate, validate } from "@std/uuid/v5";
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
