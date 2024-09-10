import { getNetworkAddress as _function_getNetworkAddress } from "jsr:@std/net@1.0.2/get-network-address"
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
 * const hostname = getNetworkAddress()!;
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 *
 * @example Get the IPv6 network address
 * ```ts no-assert no-eval
 * import { getNetworkAddress } from "@std/net/get-network-address";
 *
 * const hostname = getNetworkAddress("IPv6")!;
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 */
const getNetworkAddress = _function_getNetworkAddress as typeof _function_getNetworkAddress
export { getNetworkAddress }
