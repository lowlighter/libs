/**
 * Utilities for working with
 * {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/URL | URL}s.
 *
 * ```ts
 * import { basename, join, normalize } from "@std/url";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const url = new URL("https:///deno.land///std//assert//.//mod.ts");
 * const normalizedUrl = normalize(url);
 *
 * assertEquals(normalizedUrl.href, "https://deno.land/std/assert/mod.ts");
 * assertEquals(basename(normalizedUrl), "mod.ts");
 *
 * const joinedUrl = join(normalizedUrl, "..", "..", "async", "retry.ts");
 *
 * assertEquals(joinedUrl.href, "https://deno.land/std/async/retry.ts");
 * ```
 *
 * @module
 */
import { basename as _function_basename } from "jsr:@std/url@0.224.1"
/**
 * Returns the base name of a URL or URL string, optionally removing a suffix.
 *
 * Trailing `/`s are ignored. If no path is present, the host name is returned.
 * If a suffix is provided, it will be removed from the base name. URL queries
 * and hashes are ignored.
 *
 * @param url The URL from which to extract the base name.
 * @param suffix An optional suffix to remove from the base name.
 * @return The base name of the URL.
 *
 * @example Basic usage
 * ```ts
 * import { basename } from "@std/url/basename";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(basename("https://deno.land/std/assert/mod.ts"), "mod.ts");
 * assertEquals(basename(new URL("https://deno.land/std/assert/mod.ts")), "mod.ts");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts?a=b"), "mod.ts");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts#header"), "mod.ts");
 * assertEquals(basename("https://deno.land/"), "deno.land");
 * ```
 *
 * @example Removing a suffix
 *
 * Defining a suffix will remove it from the base name.
 *
 * ```ts
 * import { basename } from "@std/url/basename";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(basename("https://deno.land/std/assert/mod.ts", ".ts"), "mod");
 * assertEquals(basename(new URL("https://deno.land/std/assert/mod.ts"), ".ts"), "mod");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts?a=b", ".ts"), "mod");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts#header", ".ts"), "mod");
 * ```
 */
const basename = _function_basename
export { basename }

import { dirname as _function_dirname } from "jsr:@std/url@0.224.1"
/**
 * Returns the directory path URL of a URL or URL string.
 *
 * The directory path is the portion of a URL up to but excluding the final path
 * segment. URL queries and hashes are ignored.
 *
 * @param url URL to extract the directory from.
 * @return The directory path URL of the URL.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/url/dirname";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(dirname("https://deno.land/std/path/mod.ts"), new URL("https://deno.land/std/path"));
 * assertEquals(dirname(new URL("https://deno.land/std/path/mod.ts")), new URL("https://deno.land/std/path"));
 * ```
 */
const dirname = _function_dirname
export { dirname }

import { extname as _function_extname } from "jsr:@std/url@0.224.1"
/**
 * Returns the file extension of a given URL or string with leading period.
 *
 * The extension is sourced from the path portion of the URL. If there is no
 * extension, an empty string is returned. URL queries and hashes are ignored.
 *
 * @param url The URL from which to extract the extension.
 * @return The extension of the URL.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/url/extname";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(extname("https://deno.land/std/path/mod.ts"), ".ts");
 * assertEquals(extname("https://deno.land/std/path/mod"), "");
 * assertEquals(extname("https://deno.land/std/path/mod.ts?a=b"), ".ts");
 * assertEquals(extname("https://deno.land/"), "");
 * ```
 */
const extname = _function_extname
export { extname }

import { join as _function_join } from "jsr:@std/url@0.224.1"
/**
 * Joins a base URL or URL string, and a sequence of path segments together,
 * then normalizes the resulting URL.
 *
 * @param url Base URL to be joined with the paths and normalized.
 * @param paths Array of path segments to be joined to the base URL.
 * @return A complete URL containing the base URL joined with the paths.
 *
 * @example Usage
 *
 * ```ts
 * import { join } from "@std/url/join";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(join("https://deno.land/", "std", "path", "mod.ts").href, "https://deno.land/std/path/mod.ts");
 * assertEquals(join("https://deno.land", "//std", "path/", "/mod.ts").href, "https://deno.land/std/path/mod.ts");
 * ```
 */
const join = _function_join
export { join }

import { normalize as _function_normalize } from "jsr:@std/url@0.224.1"
/**
 * Normalizes the URL or URL string, resolving `..` and `.` segments. Multiple
 * sequential `/`s are resolved into a single `/`.
 *
 * @param url URL to be normalized.
 * @return Normalized URL.
 *
 * @example Usage
 *
 * ```ts
 * import { normalize } from "@std/url/normalize";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(normalize("https:///deno.land///std//assert//.//mod.ts").href, "https://deno.land/std/assert/mod.ts");
 * assertEquals(normalize("https://deno.land/std/assert/../async/retry.ts").href, "https://deno.land/std/async/retry.ts");
 * ```
 */
const normalize = _function_normalize
export { normalize }
