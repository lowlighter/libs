import { HEADER as _variable_HEADER } from "jsr:@std/http@1.0.3/header"
/**
 * HTTP Headers with status permanent
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @see {@link https://www.iana.org/assignments/http-fields/http-fields.xhtml#field-names | IANA Hypertext Transfer Protocol (HTTP) Field Name Registry}
 */
const HEADER = _variable_HEADER as typeof _variable_HEADER
export { HEADER }

import type { Header as _typeAlias_Header } from "jsr:@std/http@1.0.3/header"
/**
 * A HTTP Header
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type Header = _typeAlias_Header
export type { Header }
