import type { GetAvailablePortOptions as _interface_GetAvailablePortOptions } from "jsr:@std/net@0.224.5/get-available-port"
/**
 * Options for {@linkcode getAvailablePort}.
 */
interface GetAvailablePortOptions extends _interface_GetAvailablePortOptions {}
export type { GetAvailablePortOptions }

import { getAvailablePort as _function_getAvailablePort } from "jsr:@std/net@0.224.5/get-available-port"
/**
 * Returns an available network port.
 *
 * @param options Options for getting an available port.
 * @return An available network port.
 *
 * @example Usage
 * ```ts no-eval no-assert
 * import { getAvailablePort } from "@std/net/get-available-port";
 *
 * const port = getAvailablePort();
 * Deno.serve({ port }, () => new Response("Hello, world!"));
 * ```
 */
const getAvailablePort = _function_getAvailablePort
export { getAvailablePort }
