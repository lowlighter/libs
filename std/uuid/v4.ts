import { validate as _function_validate } from "jsr:@std/uuid@1.0.2/v4"
/**
 * Determines whether a string is a valid
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.4 | UUIDv4}.
 *
 * @param id UUID value.
 *
 * @return `true` if the UUID is valid UUIDv4, otherwise `false`.
 *
 * @example Usage
 * ```ts
 * import { validate } from "@std/uuid/v4";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(validate(crypto.randomUUID()));
 * assertFalse(validate("this-is-not-a-uuid"));
 * ```
 */
const validate = _function_validate as typeof _function_validate
export { validate }
