import { v1 as _variable_v1 } from "jsr:@std/uuid@1.0.4"
/**
 * Generator and validator for
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.1 | UUIDv1}.
 *
 * @example Usage
 * ```ts
 * import { v1 } from "@std/uuid";
 * import { assert } from "@std/assert";
 *
 * const uuid = v1.generate();
 * assert(v1.validate(uuid as string));
 * ```
 */
const v1 = _variable_v1 as typeof _variable_v1
export { v1 }

import { v3 as _variable_v3 } from "jsr:@std/uuid@1.0.4"
/**
 * Generator and validator for
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.3 | UUIDv3}.
 *
 * @example Usage
 * ```ts
 * import { v3, NAMESPACE_DNS } from "@std/uuid";
 * import { assert } from "@std/assert";
 *
 * const data = new TextEncoder().encode("deno.land");
 * const uuid = await v3.generate(NAMESPACE_DNS, data);
 * assert(v3.validate(uuid));
 * ```
 */
const v3 = _variable_v3 as typeof _variable_v3
export { v3 }

import { v4 as _variable_v4 } from "jsr:@std/uuid@1.0.4"
/**
 * Validator for
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.4 | UUIDv4}.
 *
 * @example Usage
 * ```ts
 * import { v4 } from "@std/uuid";
 * import { assert } from "@std/assert";
 *
 * const uuid = crypto.randomUUID();
 * assert(v4.validate(uuid));
 * ```
 */
const v4 = _variable_v4 as typeof _variable_v4
export { v4 }

import { v5 as _variable_v5 } from "jsr:@std/uuid@1.0.4"
/**
 * Generator and validator for
 * {@link https://www.rfc-editor.org/rfc/rfc9562.html#section-5.5 | UUIDv5}.
 *
 * @example Usage
 * ```ts
 * import { v5, NAMESPACE_DNS } from "@std/uuid";
 * import { assert } from "@std/assert";
 *
 * const data = new TextEncoder().encode("deno.land");
 * const uuid = await v5.generate(NAMESPACE_DNS, data);
 * assert(v5.validate(uuid));
 * ```
 */
const v5 = _variable_v5 as typeof _variable_v5
export { v5 }

import { isNil as _function_isNil } from "jsr:@std/uuid@1.0.4"
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

import { validate as _function_validate } from "jsr:@std/uuid@1.0.4"
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

import { version as _function_version } from "jsr:@std/uuid@1.0.4"
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

import { NAMESPACE_DNS as _variable_NAMESPACE_DNS } from "jsr:@std/uuid@1.0.4"
/**
 * Name string is a fully-qualified domain name.
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_DNS } from "@std/uuid/constants";
 * import { generate } from "@std/uuid/v5";
 *
 * await generate(NAMESPACE_DNS, new TextEncoder().encode("deno.land"));
 * ```
 */
const NAMESPACE_DNS = _variable_NAMESPACE_DNS as typeof _variable_NAMESPACE_DNS
export { NAMESPACE_DNS }

import { NAMESPACE_URL as _variable_NAMESPACE_URL } from "jsr:@std/uuid@1.0.4"
/**
 * Name string is a URL.
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_URL } from "@std/uuid/constants";
 * import { generate } from "@std/uuid/v3";
 *
 * await generate(NAMESPACE_URL, new TextEncoder().encode("https://deno.land"));
 * ```
 */
const NAMESPACE_URL = _variable_NAMESPACE_URL as typeof _variable_NAMESPACE_URL
export { NAMESPACE_URL }

import { NAMESPACE_OID as _variable_NAMESPACE_OID } from "jsr:@std/uuid@1.0.4"
/**
 * Name string is an ISO OID.
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_OID } from "@std/uuid/constants";
 * import { generate } from "@std/uuid/v5";
 *
 * await generate(NAMESPACE_OID, new TextEncoder().encode("1.3.6.1.2.1.1.1"));
 * ```
 */
const NAMESPACE_OID = _variable_NAMESPACE_OID as typeof _variable_NAMESPACE_OID
export { NAMESPACE_OID }

import { NAMESPACE_X500 as _variable_NAMESPACE_X500 } from "jsr:@std/uuid@1.0.4"
/**
 * Name string is an X.500 DN (in DER or a text output format).
 *
 * @example Usage
 * ```ts
 * import { NAMESPACE_X500 } from "@std/uuid/constants";
 * import { generate } from "@std/uuid/v3";
 *
 * await generate(NAMESPACE_X500, new TextEncoder().encode("CN=John Doe, OU=People, O=Example.com"));
 * ```
 */
const NAMESPACE_X500 = _variable_NAMESPACE_X500 as typeof _variable_NAMESPACE_X500
export { NAMESPACE_X500 }

import { NIL_UUID as _variable_NIL_UUID } from "jsr:@std/uuid@1.0.4"
/**
 * The nil UUID is special form of UUID that is specified to have all 128 bits
 * set to zero.
 */
const NIL_UUID = _variable_NIL_UUID as typeof _variable_NIL_UUID
export { NIL_UUID }
