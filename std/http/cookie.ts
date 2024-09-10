import type { Cookie as _interface_Cookie } from "jsr:@std/http@1.0.5/cookie"
/**
 * Represents an HTTP Cookie.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-4.2.1}
 */
interface Cookie extends _interface_Cookie {}
export type { Cookie }

import { getCookies as _function_getCookies } from "jsr:@std/http@1.0.5/cookie"
/**
 * Parse cookies of a header
 *
 * @example Usage
 * ```ts
 * import { getCookies } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * headers.set("Cookie", "full=of; tasty=chocolate");
 *
 * const cookies = getCookies(headers);
 * assertEquals(cookies, { full: "of", tasty: "chocolate" });
 * ```
 *
 * @param headers The headers instance to get cookies from
 * @return Object with cookie names as keys
 */
const getCookies = _function_getCookies as typeof _function_getCookies
export { getCookies }

import { setCookie as _function_setCookie } from "jsr:@std/http@1.0.5/cookie"
/**
 * Set the cookie header properly in the headers
 *
 * @example Usage
 * ```ts
 * import { Cookie, setCookie } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * const cookie: Cookie = { name: "Space", value: "Cat" };
 * setCookie(headers, cookie);
 *
 * const cookieHeader = headers.get("set-cookie");
 *
 * assertEquals(cookieHeader, "Space=Cat");
 * ```
 *
 * @param headers The headers instance to set the cookie to
 * @param cookie Cookie to set
 */
const setCookie = _function_setCookie as typeof _function_setCookie
export { setCookie }

import { deleteCookie as _function_deleteCookie } from "jsr:@std/http@1.0.5/cookie"
/**
 * Set the cookie header with empty value in the headers to delete it.
 *
 * The attributes (`path`, `domain`, `secure`, `httpOnly`, `partitioned`) need
 * to match the values when the cookie was set.
 *
 * > Note: Deleting a `Cookie` will set its expiration date before now. Forcing
 * > the browser to delete it.
 *
 * @example Usage
 * ```ts
 * import { deleteCookie } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * deleteCookie(headers, "deno");
 *
 * const cookieHeader = headers.get("set-cookie");
 *
 * assertEquals(cookieHeader, "deno=; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
 * ```
 *
 * @param headers The headers instance to delete the cookie from
 * @param name Name of cookie
 * @param attributes Additional cookie attributes
 */
const deleteCookie = _function_deleteCookie as typeof _function_deleteCookie
export { deleteCookie }

import { getSetCookies as _function_getSetCookies } from "jsr:@std/http@1.0.5/cookie"
/**
 * Parse set-cookies of a header
 *
 * @example Usage
 * ```ts
 * import { getSetCookies } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers([
 *   ["Set-Cookie", "lulu=meow; Secure; Max-Age=3600"],
 *   ["Set-Cookie", "booya=kasha; HttpOnly; Path=/"],
 * ]);
 *
 * const cookies = getSetCookies(headers);
 *
 * assertEquals(cookies[0], {
 *   name: "lulu",
 *   value: "meow",
 *   secure: true,
 *   maxAge: 3600
 * });
 * ```
 *
 * @param headers The headers instance to get set-cookies from
 * @return List of cookies
 */
const getSetCookies = _function_getSetCookies as typeof _function_getSetCookies
export { getSetCookies }
