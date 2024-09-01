import { NAMESPACE_DNS as _variable_NAMESPACE_DNS } from "jsr:@std/uuid@1.0.2/constants"
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

import { NAMESPACE_URL as _variable_NAMESPACE_URL } from "jsr:@std/uuid@1.0.2/constants"
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

import { NAMESPACE_OID as _variable_NAMESPACE_OID } from "jsr:@std/uuid@1.0.2/constants"
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

import { NAMESPACE_X500 as _variable_NAMESPACE_X500 } from "jsr:@std/uuid@1.0.2/constants"
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

import { NIL_UUID as _variable_NIL_UUID } from "jsr:@std/uuid@1.0.2/constants"
/**
 * The nil UUID is special form of UUID that is specified to have all 128 bits
 * set to zero.
 */
const NIL_UUID = _variable_NIL_UUID as typeof _variable_NIL_UUID
export { NIL_UUID }
