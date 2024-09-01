/**
 * Network utilities.
 *
 * ```ts no-assert no-eval
 * import { getNetworkAddress, getAvailablePort } from "@std/net";
 *
 * console.log(`My network IP address is ${getNetworkAddress()}`);
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
import type { GetAvailablePortOptions as _interface_GetAvailablePortOptions } from "jsr:@std/net@1.0.1"
/**
 * Options for {@linkcode getAvailablePort}.
 */
interface GetAvailablePortOptions extends _interface_GetAvailablePortOptions {}
export type { GetAvailablePortOptions }

import { getAvailablePort as _function_getAvailablePort } from "jsr:@std/net@1.0.1"
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

import { getNetworkAddress as _function_getNetworkAddress } from "jsr:@std/net@1.0.1"
/**
 * Gets the IPv4 or IPv6 network address of the machine.
 *
 * @experimental
 * @see {@link https://github.com/vercel/serve/blob/1ea55b1b5004f468159b54775e4fb3090fedbb2b/source/utilities/http.ts#L33}
 *
 * @param family The IP protocol version of the interface to get the address of.
 * @return The IPv4 network address of the machine or `undefined` if not found.
 *
 * @example Get the IPv4 network address (default)
 * ```ts no-assert no-eval
 * import { getNetworkAddress } from "@std/net/get-network-address";
 *
 * const hostname = getNetworkAddress();
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 *
 * @example Get the IPv6 network address
 * ```ts no-assert no-eval
 * import { getNetworkAddress } from "@std/net/get-network-address";
 *
 * const hostname = getNetworkAddress("IPv6");
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 */
const getNetworkAddress = _function_getNetworkAddress as typeof _function_getNetworkAddress
export { getNetworkAddress }
