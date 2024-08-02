import { signCookie as _function_signCookie } from "jsr:@std/http@1.0.0/signed-cookie"
/**
 * Returns a promise with the signed cookie value from the given cryptographic
 * key.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { signCookie } from "@std/http/signed-cookie";
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

import { verifySignedCookie as _function_verifySignedCookie } from "jsr:@std/http@1.0.0/signed-cookie"
/**
 * Returns a promise of a boolean indicating whether the signed cookie is valid.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifySignedCookie } from "@std/http/signed-cookie";
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
 * await verifySignedCookie(signedCookie, key);
 * ```
 *
 * @param signedCookie The signed cookie to verify.
 * @param key The cryptographic key to verify the cookie with.
 * @return Whether or not the cookie is valid.
 */
const verifySignedCookie = _function_verifySignedCookie
export { verifySignedCookie }

import { parseSignedCookie as _function_parseSignedCookie } from "jsr:@std/http@1.0.0/signed-cookie"
/**
 * Parses a signed cookie to get its value.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * Important: always verify the cookie using {@linkcode verifySignedCookie} first.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifySignedCookie, parseSignedCookie } from "@std/http/signed-cookie";
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
 * await verifySignedCookie(signedCookie, key);
 * const cookie = parseSignedCookie(signedCookie);
 * ```
 *
 * @param signedCookie The signed cookie to parse the value from.
 * @return The parsed cookie.
 */
const parseSignedCookie = _function_parseSignedCookie
export { parseSignedCookie }
