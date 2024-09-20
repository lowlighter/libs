/**
 * Network utilities.
 *
 * ```ts no-assert no-eval
 * import { getAvailablePort } from "@std/net";
 *
 * const command = new Deno.Command(Deno.execPath(), {
 *  args: ["test.ts", "--port", getAvailablePort().toString()],
 * });
 *
 * // ...
 * ```
 *
 * @module
 */
import type { GetAvailablePortOptions as _interface_GetAvailablePortOptions } from "jsr:@std/net@1.0.4"
/**
 * Options for {@linkcode getAvailablePort}.
 */
interface GetAvailablePortOptions extends _interface_GetAvailablePortOptions {}
export type { GetAvailablePortOptions }

import { getAvailablePort as _function_getAvailablePort } from "jsr:@std/net@1.0.4"
/**
 * Returns an available network port.
 *
 * > [!IMPORTANT]
 * > In most cases, this function is not needed. Do not use it for trivial uses
 * > such as when using {@linkcode Deno.serve} or {@linkcode Deno.listen}
 * > directly. Instead, set the `port` option to `0` to automatically use an
 * > available port, then get the assigned port from the function's return
 * > object (see "Recommended Usage" example).
 *
 * @param options Options for getting an available port.
 * @return An available network port.
 *
 * @example Recommended Usage
 *
 * Bad:
 * ```ts no-eval no-assert
 * import { getAvailablePort } from "@std/net/get-available-port";
 *
 * const port = getAvailablePort();
 * Deno.serve({ port }, () => new Response("Hello, world!"));
 * ```
 *
 * Good:
 * ```ts no-eval no-assert
 * const { port } = Deno.serve({ port: 0 }, () => new Response("Hello, world!")).addr;
 * ```
 *
 * Good:
 * ```ts no-eval no-assert
 * import { getAvailablePort } from "@std/net/get-available-port";
 *
 * const command = new Deno.Command(Deno.execPath(), {
 *   args: ["test.ts", "--port", getAvailablePort().toString()],
 * });
 * // ...
 * ```
 */
const getAvailablePort = _function_getAvailablePort as typeof _function_getAvailablePort
export { getAvailablePort }
