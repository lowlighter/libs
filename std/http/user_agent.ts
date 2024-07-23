import type { Browser as _interface_Browser } from "jsr:@std/http@0.224.5/user-agent"
/**
 * The browser as described by a user agent string.
 */
interface Browser extends _interface_Browser {}
export type { Browser }

import type { Device as _interface_Device } from "jsr:@std/http@0.224.5/user-agent"
/**
 * The device as described by a user agent string.
 */
interface Device extends _interface_Device {}
export type { Device }

import type { Engine as _interface_Engine } from "jsr:@std/http@0.224.5/user-agent"
/**
 * The browser engine as described by a user agent string.
 */
interface Engine extends _interface_Engine {}
export type { Engine }

import type { Os as _interface_Os } from "jsr:@std/http@0.224.5/user-agent"
/**
 * The OS as described by a user agent string.
 */
interface Os extends _interface_Os {}
export type { Os }

import type { Cpu as _interface_Cpu } from "jsr:@std/http@0.224.5/user-agent"
/**
 * The CPU information as described by a user agent string.
 */
interface Cpu extends _interface_Cpu {}
export type { Cpu }

import { UserAgent as _class_UserAgent } from "jsr:@std/http@0.224.5/user-agent"
/**
 * A representation of user agent string, which can be used to determine
 * environmental information represented by the string. All properties are
 * determined lazily.
 *
 * @example Usage
 * ```ts no-eval
 * import { UserAgent } from "@std/http/user-agent";
 *
 * Deno.serve((req) => {
 *   const userAgent = new UserAgent(req.headers.get("user-agent") ?? "");
 *   return new Response(`Hello, ${userAgent.browser.name}
 *     on ${userAgent.os.name} ${userAgent.os.version}!`);
 * });
 * ```
 */
class UserAgent extends _class_UserAgent {}
export { UserAgent }
