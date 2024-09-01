import { basename as _function_basename } from "jsr:@std/path@1.0.3/posix"
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/posix/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("/home/user/Documents/"), "Documents");
 * assertEquals(basename("/home/user/Documents/image.png"), "image.png");
 * assertEquals(basename("/home/user/Documents/image.png", ".png"), "image");
 * ```
 *
 * @example Working with URLs
 *
 * Note: This function doesn't automatically strip hash and query parts from
 * URLs. If your URL contains a hash or query, remove them before passing the
 * URL to the function. This can be done by passing the URL to `new URL(url)`,
 * and setting the `hash` and `search` properties to empty strings.
 *
 * ```ts
 * import { basename } from "@std/path/posix/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("https://deno.land/std/path/mod.ts"), "mod.ts");
 * assertEquals(basename("https://deno.land/std/path/mod.ts", ".ts"), "mod");
 * assertEquals(basename("https://deno.land/std/path/mod.ts?a=b"), "mod.ts?a=b");
 * assertEquals(basename("https://deno.land/std/path/mod.ts#header"), "mod.ts#header");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @return The extracted name.
 */
const basename = _function_basename as typeof _function_basename
export { basename }

import { DELIMITER as _variable_DELIMITER } from "jsr:@std/path@1.0.3/posix"
/**
 * The character used to separate entries in the PATH environment variable.
 */
const DELIMITER = _variable_DELIMITER as typeof _variable_DELIMITER
export { DELIMITER }

import { SEPARATOR as _variable_SEPARATOR } from "jsr:@std/path@1.0.3/posix"
/**
 * The character used to separate components of a file path.
 */
const SEPARATOR = _variable_SEPARATOR as typeof _variable_SEPARATOR
export { SEPARATOR }

import { SEPARATOR_PATTERN as _variable_SEPARATOR_PATTERN } from "jsr:@std/path@1.0.3/posix"
/**
 * A regular expression that matches one or more path separators.
 */
const SEPARATOR_PATTERN = _variable_SEPARATOR_PATTERN as typeof _variable_SEPARATOR_PATTERN
export { SEPARATOR_PATTERN }

import { dirname as _function_dirname } from "jsr:@std/path@1.0.3/posix"
/** UNDOCUMENTED */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }

import { extname as _function_extname } from "jsr:@std/path@1.0.3/posix"
/** UNDOCUMENTED */
const extname = _function_extname as typeof _function_extname
export { extname }

import { format as _function_format } from "jsr:@std/path@1.0.3/posix"
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/path/posix/format";
 * import { assertEquals } from "@std/assert";
 *
 * const path = format({
 *   root: "/",
 *   dir: "/path/dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * assertEquals(path, "/path/dir/file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @return The formatted path.
 */
const format = _function_format as typeof _function_format
export { format }

import { fromFileUrl as _function_fromFileUrl } from "jsr:@std/path@1.0.3/posix"
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@std/path/posix/from-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(fromFileUrl(new URL("file:///home/foo")), "/home/foo");
 * ```
 *
 * @param url The file URL to convert.
 * @return The path string.
 */
const fromFileUrl = _function_fromFileUrl as typeof _function_fromFileUrl
export { fromFileUrl }

import { isAbsolute as _function_isAbsolute } from "jsr:@std/path@1.0.3/posix"
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/posix/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @return Whether the path is absolute.
 */
const isAbsolute = _function_isAbsolute as typeof _function_isAbsolute
export { isAbsolute }

import { join as _function_join } from "jsr:@std/path@1.0.3/posix"
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@std/path/posix/join";
 * import { assertEquals } from "@std/assert";
 *
 * const path = join("/foo", "bar", "baz/asdf", "quux", "..");
 * assertEquals(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 * ```ts
 * import { join } from "@std/path/posix/join";
 * import { assertEquals } from "@std/assert";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = join("std", "path", "mod.ts");
 * assertEquals(url.href, "https://deno.land/std/path/mod.ts");
 *
 * url.pathname = join("//std", "path/", "/mod.ts");
 * assertEquals(url.href, "https://deno.land/std/path/mod.ts");
 * ```
 *
 * @param paths The paths to join.
 * @return The joined path.
 */
const join = _function_join as typeof _function_join
export { join }

import { normalize as _function_normalize } from "jsr:@std/path@1.0.3/posix"
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/posix/normalize";
 * import { assertEquals } from "@std/assert";
 *
 * const path = normalize("/foo/bar//baz/asdf/quux/..");
 * assertEquals(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 *
 * Note: This function will remove the double slashes from a URL's scheme.
 * Hence, do not pass a full URL to this function. Instead, pass the pathname of
 * the URL.
 *
 * ```ts
 * import { normalize } from "@std/path/posix/normalize";
 * import { assertEquals } from "@std/assert";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = normalize("//std//assert//.//mod.ts");
 * assertEquals(url.href, "https://deno.land/std/assert/mod.ts");
 *
 * url.pathname = normalize("std/assert/../async/retry.ts");
 * assertEquals(url.href, "https://deno.land/std/async/retry.ts");
 * ```
 *
 * @param path The path to normalize.
 * @return The normalized path.
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }

import type { ParsedPath as _interface_ParsedPath } from "jsr:@std/path@1.0.3/posix"
/**
 * A parsed path object generated by path.parse() or consumed by path.format().
 *
 * @example ```ts
 * import { parse } from "@std/path";
 *
 * const parsedPathObj = parse("c:\\path\\dir\\index.html");
 * parsedPathObj.root; // "c:\\"
 * parsedPathObj.dir; // "c:\\path\\dir"
 * parsedPathObj.base; // "index.html"
 * parsedPathObj.ext; // ".html"
 * parsedPathObj.name; // "index"
 * ```
 */
interface ParsedPath extends _interface_ParsedPath {}
export type { ParsedPath }

import { parse as _function_parse } from "jsr:@std/path@1.0.3/posix"
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/path/posix/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const path = parse("/home/user/file.txt");
 * assertEquals(path, {
 *   root: "/",
 *   dir: "/home/user",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * ```
 *
 * @param path The path to parse.
 * @return The parsed path object.
 */
const parse = _function_parse as typeof _function_parse
export { parse }

import { relative as _function_relative } from "jsr:@std/path@1.0.3/posix"
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * If `from` and `to` are the same, return an empty string.
 *
 * @example Usage
 * ```ts
 * import { relative } from "@std/path/posix/relative";
 * import { assertEquals } from "@std/assert";
 *
 * const path = relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
 * assertEquals(path, "../../impl/bbb");
 * ```
 *
 * @param from The path to start from.
 * @param to The path to reach.
 * @return The relative path.
 */
const relative = _function_relative as typeof _function_relative
export { relative }

import { resolve as _function_resolve } from "jsr:@std/path@1.0.3/posix"
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@std/path/posix/resolve";
 * import { assertEquals } from "@std/assert";
 *
 * const path = resolve("/foo", "bar", "baz/asdf", "quux", "..");
 * assertEquals(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @param pathSegments The path segments to resolve.
 * @return The resolved path.
 */
const resolve = _function_resolve as typeof _function_resolve
export { resolve }

import { toFileUrl as _function_toFileUrl } from "jsr:@std/path@1.0.3/posix"
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@std/path/posix/to-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toFileUrl("/home/foo"), new URL("file:///home/foo"));
 * assertEquals(toFileUrl("/home/foo bar"), new URL("file:///home/foo%20bar"));
 * ```
 *
 * @param path The path to convert.
 * @return The file URL.
 */
const toFileUrl = _function_toFileUrl as typeof _function_toFileUrl
export { toFileUrl }

import { toNamespacedPath as _function_toNamespacedPath } from "jsr:@std/path@1.0.3/posix"
/**
 * Converts a path to a namespaced path. This function returns the path as is on posix.
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/posix/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toNamespacedPath("/home/foo"), "/home/foo");
 * ```
 *
 * @param path The path.
 * @return The namespaced path.
 */
const toNamespacedPath = _function_toNamespacedPath as typeof _function_toNamespacedPath
export { toNamespacedPath }

import { common as _function_common } from "jsr:@std/path@1.0.3/posix"
/**
 * Determines the common path from a set of paths for POSIX systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@std/path/posix/common";
 * import { assertEquals } from "@std/assert";
 *
 * const path = common([
 *   "./deno/std/path/mod.ts",
 *   "./deno/std/fs/mod.ts",
 * ]);
 * assertEquals(path, "./deno/std/");
 * ```
 *
 * @param paths The paths to compare.
 * @return The common path.
 */
const common = _function_common as typeof _function_common
export { common }

import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.3/posix"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { globToRegExp as _function_globToRegExp } from "jsr:@std/path@1.0.3/posix"
/**
 * Convert a glob string to a regular expression.
 *
 * Tries to match bash glob expansion as closely as possible.
 *
 * Basic glob syntax:
 * - `*` - Matches everything without leaving the path segment.
 * - `?` - Matches any single character.
 * - `{foo,bar}` - Matches `foo` or `bar`.
 * - `[abcd]` - Matches `a`, `b`, `c` or `d`.
 * - `[a-d]` - Matches `a`, `b`, `c` or `d`.
 * - `[!abcd]` - Matches any single character besides `a`, `b`, `c` or `d`.
 * - `[[:<class>:]]` - Matches any character belonging to `<class>`.
 *     - `[[:alnum:]]` - Matches any digit or letter.
 *     - `[[:digit:]abc]` - Matches any digit, `a`, `b` or `c`.
 *     - See https://facelessuser.github.io/wcmatch/glob/#posix-character-classes
 *       for a complete list of supported character classes.
 * - `\` - Escapes the next character for an `os` other than `"windows"`.
 * - \` - Escapes the next character for `os` set to `"windows"`.
 * - `/` - Path separator.
 * - `\` - Additional path separator only for `os` set to `"windows"`.
 *
 * Extended syntax:
 * - Requires `{ extended: true }`.
 * - `?(foo|bar)` - Matches 0 or 1 instance of `{foo,bar}`.
 * - `@(foo|bar)` - Matches 1 instance of `{foo,bar}`. They behave the same.
 * - `*(foo|bar)` - Matches _n_ instances of `{foo,bar}`.
 * - `+(foo|bar)` - Matches _n > 0_ instances of `{foo,bar}`.
 * - `!(foo|bar)` - Matches anything other than `{foo,bar}`.
 * - See https://www.linuxjournal.com/content/bash-extended-globbing.
 *
 * Globstar syntax:
 * - Requires `{ globstar: true }`.
 * - `**` - Matches any number of any path segments.
 *     - Must comprise its entire path segment in the provided glob.
 * - See https://www.linuxjournal.com/content/globstar-new-bash-globbing-option.
 *
 * Note the following properties:
 * - The generated `RegExp` is anchored at both start and end.
 * - Repeating and trailing separators are tolerated. Trailing separators in the
 *   provided glob have no meaning and are discarded.
 * - Absolute globs will only match absolute paths, etc.
 * - Empty globs will match nothing.
 * - Any special glob syntax must be contained to one path segment. For example,
 *   `?(foo|bar/baz)` is invalid. The separator will take precedence and the
 *   first segment ends with an unclosed group.
 * - If a path segment ends with unclosed groups or a dangling escape prefix, a
 *   parse error has occurred. Every character for that segment is taken
 *   literally in this event.
 *
 * Limitations:
 * - A negative group like `!(foo|bar)` will wrongly be converted to a negative
 *   look-ahead followed by a wildcard. This means that `!(foo).js` will wrongly
 *   fail to match `foobar.js`, even though `foobar` is not `foo`. Effectively,
 *   `!(foo|bar)` is treated like `!(@(foo|bar)*)`. This will work correctly if
 *   the group occurs not nested at the end of the segment.
 *
 * @example Usage
 * ```ts
 * import { globToRegExp } from "@std/path/posix/glob-to-regexp";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(globToRegExp("*.js"), /^[^/]*\.js\/*$/);
 * ```
 *
 * @param glob Glob string to convert.
 * @param options Conversion options.
 * @return The regular expression equivalent to the glob.
 */
const globToRegExp = _function_globToRegExp as typeof _function_globToRegExp
export { globToRegExp }

import { isGlob as _function_isGlob } from "jsr:@std/path@1.0.3/posix"
/**
 * Test whether the given string is a glob.
 *
 * @example Usage
 * ```ts
 * import { isGlob } from "@std/path/is-glob";
 * import { assert } from "@std/assert";
 *
 * assert(!isGlob("foo/bar/../baz"));
 * assert(isGlob("foo/*ar/../baz"));
 * ```
 *
 * @param str String to test.
 * @return `true` if the given string is a glob, otherwise `false`
 */
const isGlob = _function_isGlob as typeof _function_isGlob
export { isGlob }

import { joinGlobs as _function_joinGlobs } from "jsr:@std/path@1.0.3/posix"
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@std/path/posix/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * const path = joinGlobs(["foo", "bar", "**"], { globstar: true });
 * assertEquals(path, "foo/bar/**");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options to use.
 * @return The joined path.
 */
const joinGlobs = _function_joinGlobs as typeof _function_joinGlobs
export { joinGlobs }

import { normalizeGlob as _function_normalizeGlob } from "jsr:@std/path@1.0.3/posix"
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@std/path/posix/normalize-glob";
 * import { assertEquals } from "@std/assert";
 *
 * const path = normalizeGlob("foo/bar/../*", { globstar: true });
 * assertEquals(path, "foo/*");
 * ```
 *
 * @param glob The glob to normalize.
 * @param options The options to use.
 * @return The normalized path.
 */
const normalizeGlob = _function_normalizeGlob as typeof _function_normalizeGlob
export { normalizeGlob }
