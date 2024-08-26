import { METHOD as _variable_METHOD } from "jsr:@std/http@1.0.3/method"
/**
 * HTTP Methods derived from IANA Hypertext Transfer Protocol (HTTP) Method Registry
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @see {@link https://www.iana.org/assignments/http-methods/http-methods.xhtml#methods | IANA Hypertext Transfer Protocol (HTTP) Method Registry}
 */
const METHOD = _variable_METHOD as typeof _variable_METHOD
export { METHOD }

import type { Method as _typeAlias_Method } from "jsr:@std/http@1.0.3/method"
/**
 * A HTTP Method
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type Method = _typeAlias_Method
export type { Method }
