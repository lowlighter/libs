/**
 * Network utilities.
 *
 * ```ts no-assert no-eval
 * import { getNetworkAddress, getAvailablePort } from "@std/net";
 *
 * console.log(`My network IP address is ${getNetworkAddress()}`);
 *
 * Deno.serve({ port: getAvailablePort() }, () => new Response("Hello, world!"));
 * ```
 *
 * @module
 */
import type { GetAvailablePortOptions as _interface_GetAvailablePortOptions } from "jsr:@std/net@0.224.5"
/**
 * Options for {@linkcode getAvailablePort}.
 */
interface GetAvailablePortOptions extends _interface_GetAvailablePortOptions {}
export type { GetAvailablePortOptions }

import { getAvailablePort as _function_getAvailablePort } from "jsr:@std/net@0.224.5"
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

import { getNetworkAddress as _function_getNetworkAddress } from "jsr:@std/net@0.224.5"
/**
 * **UNSTABLE**: New API, yet to be vetted.
 *
 * Gets the IPv4 or IPv6 network address of the machine.
 *
 * This is inspired by the util of the same name in
 * {@linkcode https://www.npmjs.com/package/serve | npm:serve}.
 *
 * For more advanced use, use {@linkcode Deno.networkInterfaces} directly.
 *
 * @see {@link https://github.com/vercel/serve/blob/1ea55b1b5004f468159b54775e4fb3090fedbb2b/source/utilities/http.ts#L33}
 *
 * @param family The IP protocol version of the interface to get the address of.
 * @return The IPv4 network address of the machine.
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
 *
 * @experimental
 */
const getNetworkAddress = _function_getNetworkAddress
export { getNetworkAddress }
