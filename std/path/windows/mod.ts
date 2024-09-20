import { basename as _function_basename } from "jsr:@std/path@1.0.6/windows"
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/windows/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("C:\\user\\Documents\\"), "Documents");
 * assertEquals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * assertEquals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `basename` from `@std/path/windows/unstable-basename`.
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @return The extracted name.
 */
const basename = _function_basename as typeof _function_basename
export { basename }

import { DELIMITER as _variable_DELIMITER } from "jsr:@std/path@1.0.6/windows"
/**
 * The character used to separate entries in the PATH environment variable.
 */
const DELIMITER = _variable_DELIMITER as typeof _variable_DELIMITER
export { DELIMITER }

import { SEPARATOR as _variable_SEPARATOR } from "jsr:@std/path@1.0.6/windows"
/**
 * The character used to separate components of a file path.
 */
const SEPARATOR = _variable_SEPARATOR as typeof _variable_SEPARATOR
export { SEPARATOR }

import { SEPARATOR_PATTERN as _variable_SEPARATOR_PATTERN } from "jsr:@std/path@1.0.6/windows"
/**
 * A regular expression that matches one or more path separators.
 */
const SEPARATOR_PATTERN = _variable_SEPARATOR_PATTERN as typeof _variable_SEPARATOR_PATTERN
export { SEPARATOR_PATTERN }

import { dirname as _function_dirname } from "jsr:@std/path@1.0.6/windows"
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/windows/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * const dir = dirname("C:\\foo\\bar\\baz.ext");
 * assertEquals(dir, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@std/path/windows/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }

import { extname as _function_extname } from "jsr:@std/path@1.0.6/windows"
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/windows/extname";
 * import { assertEquals } from "@std/assert";
 *
 * const ext = extname("file.ts");
 * assertEquals(ext, ".ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@std/path/windows/unstable-extname`.
 *
 * @param path The path to get the extension from.
 * @return The extension of the `path`.
 */
const extname = _function_extname as typeof _function_extname
export { extname }

import { format as _function_format } from "jsr:@std/path@1.0.6/windows"
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/path/windows/format";
 * import { assertEquals } from "@std/assert";
 *
 * const path = format({
 *   root: "C:\\",
 *   dir: "C:\\path\\dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * assertEquals(path, "C:\\path\\dir\\file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @return The formatted path.
 */
const format = _function_format as typeof _function_format
export { format }

import { fromFileUrl as _function_fromFileUrl } from "jsr:@std/path@1.0.6/windows"
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@std/path/windows/from-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(fromFileUrl("file:///home/foo"), "\\home\\foo");
 * assertEquals(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 * assertEquals(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * ```
 *
 * @param url The file URL to convert.
 * @return The path string.
 */
const fromFileUrl = _function_fromFileUrl as typeof _function_fromFileUrl
export { fromFileUrl }

import { isAbsolute as _function_isAbsolute } from "jsr:@std/path@1.0.6/windows"
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/windows/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isAbsolute("C:\\foo\\bar"));
 * assertFalse(isAbsolute("..\\baz"));
 * ```
 *
 * @param path The path to verify.
 * @return `true` if the path is absolute, `false` otherwise.
 */
const isAbsolute = _function_isAbsolute as typeof _function_isAbsolute
export { isAbsolute }

import { join as _function_join } from "jsr:@std/path@1.0.6/windows"
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@std/path/windows/join";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * assertEquals(joined, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@std/path/windows/unstable-join`.
 *
 * @param paths The paths to join.
 * @return The joined path.
 */
const join = _function_join as typeof _function_join
export { join }

import { normalize as _function_normalize } from "jsr:@std/path@1.0.6/windows"
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/windows/normalize";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalize("C:\\foo\\..\\bar");
 * assertEquals(normalized, "C:\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@std/path/windows/unstable-normalize`.
 *
 * @param path The path to normalize
 * @return The normalized path
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }

import type { ParsedPath as _interface_ParsedPath } from "jsr:@std/path@1.0.6/windows"
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

import { parse as _function_parse } from "jsr:@std/path@1.0.6/windows"
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/path/windows/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const parsed = parse("C:\\foo\\bar\\baz.ext");
 * assertEquals(parsed, {
 *   root: "C:\\",
 *   dir: "C:\\foo\\bar",
 *   base: "baz.ext",
 *   ext: ".ext",
 *   name: "baz",
 * });
 * ```
 *
 * @param path The path to parse.
 * @return The `ParsedPath` object.
 */
const parse = _function_parse as typeof _function_parse
export { parse }

import { relative as _function_relative } from "jsr:@std/path@1.0.6/windows"
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * An example in windws, for instance:
 *  from = 'C:\\orandea\\test\\aaa'
 *  to = 'C:\\orandea\\impl\\bbb'
 * The output of the function should be: '..\\..\\impl\\bbb'
 *
 * @example Usage
 * ```ts
 * import { relative } from "@std/path/windows/relative";
 * import { assertEquals } from "@std/assert";
 *
 * const relativePath = relative("C:\\foobar\\test\\aaa", "C:\\foobar\\impl\\bbb");
 * assertEquals(relativePath, "..\\..\\impl\\bbb");
 * ```
 *
 * @param from The path from which to calculate the relative path
 * @param to The path to which to calculate the relative path
 * @return The relative path from `from` to `to`
 */
const relative = _function_relative as typeof _function_relative
export { relative }

import { resolve as _function_resolve } from "jsr:@std/path@1.0.6/windows"
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@std/path/windows/resolve";
 * import { assertEquals } from "@std/assert";
 *
 * const resolved = resolve("C:\\foo\\bar", "..\\baz");
 * assertEquals(resolved, "C:\\foo\\baz");
 * ```
 *
 * @param pathSegments The path segments to process to path
 * @return The resolved path
 */
const resolve = _function_resolve as typeof _function_resolve
export { resolve }

import { toFileUrl as _function_toFileUrl } from "jsr:@std/path@1.0.6/windows"
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@std/path/windows/to-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toFileUrl("\\home\\foo"), new URL("file:///home/foo"));
 * assertEquals(toFileUrl("C:\\Users\\foo"), new URL("file:///C:/Users/foo"));
 * assertEquals(toFileUrl("\\\\127.0.0.1\\home\\foo"), new URL("file://127.0.0.1/home/foo"));
 * ```
 * @param path The path to convert.
 * @return The file URL.
 */
const toFileUrl = _function_toFileUrl as typeof _function_toFileUrl
export { toFileUrl }

import { toNamespacedPath as _function_toNamespacedPath } from "jsr:@std/path@1.0.6/windows"
/**
 * Resolves path to a namespace path
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/windows/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * const namespaced = toNamespacedPath("C:\\foo\\bar");
 * assertEquals(namespaced, "\\\\?\\C:\\foo\\bar");
 * ```
 *
 * @param path The path to resolve to namespaced path
 * @return The resolved namespaced path
 */
const toNamespacedPath = _function_toNamespacedPath as typeof _function_toNamespacedPath
export { toNamespacedPath }

import { common as _function_common } from "jsr:@std/path@1.0.6/windows"
/**
 * Determines the common path from a set of paths for Windows systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@std/path/windows/common";
 * import { assertEquals } from "@std/assert";
 *
 * const path = common([
 *   "C:\\foo\\bar",
 *   "C:\\foo\\baz",
 * ]);
 * assertEquals(path, "C:\\foo\\");
 * ```
 *
 * @param paths The paths to compare.
 * @return The common path.
 */
const common = _function_common as typeof _function_common
export { common }

import { globToRegExp as _function_globToRegExp } from "jsr:@std/path@1.0.6/windows"
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
 * import { globToRegExp } from "@std/path/windows/glob-to-regexp";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(globToRegExp("*.js"), /^[^\\/]*\.js(?:\\|\/)*$/);
 * ```
 *
 * @param glob Glob string to convert.
 * @param options Conversion options.
 * @return The regular expression equivalent to the glob.
 */
const globToRegExp = _function_globToRegExp as typeof _function_globToRegExp
export { globToRegExp }

import { isGlob as _function_isGlob } from "jsr:@std/path@1.0.6/windows"
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

import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.6/windows"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { joinGlobs as _function_joinGlobs } from "jsr:@std/path@1.0.6/windows"
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 *
 * ```ts
 * import { joinGlobs } from "@std/path/windows/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = joinGlobs(["foo", "**", "bar"], { globstar: true });
 * assertEquals(joined, "foo\\**\\bar");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options for glob pattern.
 * @return The joined glob pattern.
 */
const joinGlobs = _function_joinGlobs as typeof _function_joinGlobs
export { joinGlobs }

import { normalizeGlob as _function_normalizeGlob } from "jsr:@std/path@1.0.6/windows"
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@std/path/windows/normalize-glob";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * assertEquals(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @return The normalized glob pattern.
 */
const normalizeGlob = _function_normalizeGlob as typeof _function_normalizeGlob
export { normalizeGlob }
