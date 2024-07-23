import { signCookie as _function_signCookie } from "jsr:@std/http@0.224.5/unstable-signed-cookie"
/**
 * Returns a promise with the signed cookie value from the given cryptographic
 * key.
 *
 * @example Usage
 * ```ts no-eval no-assert
 * import { signCookie } from "@std/http/unstable-signed-cookie";
 * import { setCookie } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 * const value = await signCookie("my-cookie-value", key);
 *
 * const headers = new Headers();
 * setCookie(headers, {
 *   name: "my-cookie-name",
 *   value,
 * });
 *
 * const cookieHeader = headers.get("set-cookie");
 * ```
 *
 * @param value The cookie value to sign.
 * @param key The cryptographic key to sign the cookie with.
 * @return The signed cookie.
 */
const signCookie = _function_signCookie
export { signCookie }

import { verifyCookie as _function_verifyCookie } from "jsr:@std/http@0.224.5/unstable-signed-cookie"
/**
 * Returns a promise of a boolean indicating whether the signed cookie is valid.
 *
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifyCookie } from "@std/http/unstable-signed-cookie";
 * import { getCookies } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 *
 * const headers = new Headers({
 *   Cookie: "location=tokyo.37f7481039762eef5cd46669f93c0a3214dfecba7d0cdc0b0dc40036063fb22e",
 * });
 * const signedCookie = getCookies(headers)["location"];
 * if (signedCookie === undefined) throw new Error("Cookie not found");
 * await verifyCookie(signedCookie, key);
 * ```
 *
 * @param signedCookie The signed cookie to verify.
 * @param key The cryptographic key to verify the cookie with.
 * @return Whether or not the cookie is valid.
 */
const verifyCookie = _function_verifyCookie
export { verifyCookie }

import { parseSignedCookie as _function_parseSignedCookie } from "jsr:@std/http@0.224.5/unstable-signed-cookie"
/**
 * Parses a signed cookie to get its value.
 *
 * Important: always verify the cookie using {@linkcode verifyCookie} first.
 *
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifyCookie, parseSignedCookie } from "@std/http/unstable-signed-cookie";
 * import { getCookies } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 *
 * const headers = new Headers({
 *   Cookie: "location=tokyo.37f7481039762eef5cd46669f93c0a3214dfecba7d0cdc0b0dc40036063fb22e",
 * });
 * const signedCookie = getCookies(headers)["location"];
 * if (signedCookie === undefined) throw new Error("Cookie not found");
 * await verifyCookie(signedCookie, key);
 * const cookie = parseSignedCookie(signedCookie);
 * ```
 *
 * @param signedCookie The signed cookie to parse the value from.
 * @return The parsed cookie.
 */
const parseSignedCookie = _function_parseSignedCookie
export { parseSignedCookie }
