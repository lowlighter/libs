/**
 * {@linkcode parse} and {@linkcode stringify} for handling
 * {@link https://en.wikipedia.org/wiki/INI_file | INI} encoded data, such as the
 * {@link https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s03.html | Desktop Entry specification}.
 * Values are parsed as strings by default to preserve data parity from the original.
 * Customization is possible in the form of reviver/replacer functions like those in `JSON.parse` and `JSON.stringify`.
 * Nested sections, repeated key names within a section, and key/value arrays are not supported,
 * but will be preserved when using {@linkcode IniMap}. Multi-line values are not supported and will throw a syntax error.
 * White space padding and lines starting with '#', ';', or '//' will be treated as comments.
 *
 * ```ts
 * import * as ini from "@std/ini";
 * import { assertEquals } from "@std/assert";
 *
 * const iniFile = `# Example configuration file
 * Global Key=Some data here
 *
 * [Section #1]
 * Section Value=42
 * Section Date=1977-05-25`;
 *
 * const parsed = ini.parse(iniFile, {
 *   reviver(key, value, section) {
 *     if (section === "Section #1") {
 *       if (key === "Section Value") return Number(value);
 *       if (key === "Section Date") return new Date(value);
 *     }
 *     return value;
 *   },
 * });
 *
 * assertEquals(parsed, {
 *   "Global Key": "Some data here",
 *   "Section #1": {
 *     "Section Value": 42,
 *     "Section Date": new Date("1977-05-25T00:00:00.000Z"),
 *   },
 * });
 *
 * const text = ini.stringify(parsed, {
 *   replacer(key, value, section) {
 *     if (section === "Section #1" && key === "Section Date") {
 *       return (value as Date).toISOString().split("T")[0];
 *     }
 *     return value;
 *   },
 * });
 *
 * assertEquals(text, `Global Key=Some data here
 * [Section #1]
 * Section Value=42
 * Section Date=1977-05-25`);
 * ```
 *
 * Optionally, {@linkcode IniMap} may be used for finer INI handling. Using this class will permit preserving
 * comments, accessing values like a map, iterating over key/value/section entries, and more.
 *
 * ```ts
 * import { IniMap } from "@std/ini/ini-map";
 * import { assertEquals } from "@std/assert";
 *
 * const ini = new IniMap();
 * ini.set("section1", "keyA", 100);
 * assertEquals(ini.toString(), `[section1]
 * keyA=100`);
 *
 * ini.set('keyA', 25)
 * assertEquals(ini.toObject(), {
 *   keyA: 25,
 *   section1: {
 *     keyA: 100
 *   }
 * });
 * ```
 *
 * The reviver and replacer APIs can be used to extend the behavior of IniMap, such as adding support
 * for duplicate keys as if they were arrays of values.
 *
 * ```ts
 * import { IniMap } from "@std/ini/ini-map";
 * import { assertEquals } from "@std/assert";
 *
 * const iniFile = `# Example of key/value arrays
 * [section1]
 * key1=This key
 * key1=is non-standard
 * key1=but can be captured!`;
 *
 * const ini = new IniMap({ assignment: "=", deduplicate: true });
 * ini.parse(iniFile, (key, value, section) => {
 *   if (section) {
 *     if (ini.has(section, key)) {
 *       const exists = ini.get(section, key);
 *       if (Array.isArray(exists)) {
 *         exists.push(value);
 *         return exists;
 *       } else {
 *         return [exists, value];
 *       }
 *     }
 *   }
 *   return value;
 * });
 *
 * assertEquals(
 *   ini.get("section1", "key1"),
 *   ["This key", "is non-standard", "but can be captured!"]
 * );
 *
 * const result = ini.toString((key, value) => {
 *   if (Array.isArray(value)) {
 *     return value.join(
 *       `${ini.formatting.lineBreak}${key}${ini.formatting.assignment}`,
 *     );
 *   }
 *   return value;
 * });
 *
 * assertEquals(result, iniFile);
 * ```
 *
 * @module
 */
import type { FormattingOptions as _interface_FormattingOptions } from "jsr:@std/ini@0.225.2"
/**
 * Options for providing formatting marks.
 */
interface FormattingOptions extends _interface_FormattingOptions {}
export type { FormattingOptions }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/ini@0.225.2"
/**
 * Options for parsing INI strings.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import type { ReplacerFunction as _typeAlias_ReplacerFunction } from "jsr:@std/ini@0.225.2"
/**
 * Function for replacing JavaScript values with INI string values.
 */
type ReplacerFunction = _typeAlias_ReplacerFunction
export type { ReplacerFunction }

import type { ReviverFunction as _typeAlias_ReviverFunction } from "jsr:@std/ini@0.225.2"
/**
 * Function for replacing INI values with JavaScript values.
 */
type ReviverFunction = _typeAlias_ReviverFunction
export type { ReviverFunction }

import { IniMap as _class_IniMap } from "jsr:@std/ini@0.225.2"
/**
 * Class implementation for fine control of INI data structures.
 *
 * @example Usage
 * ```ts
 * import { IniMap } from "@std/ini";
 * import { assertEquals } from "@std/assert";
 *
 * const ini = new IniMap();
 * ini.set("section1", "keyA", 100)
 * assertEquals(ini.toString(), `[section1]
 * keyA=100`)
 *
 * ini.set('keyA', 25)
 * assertEquals(ini.toObject(), {
 *   keyA: 25,
 *   section1: {
 *     keyA: 100,
 *   },
 * });
 * ```
 */
class IniMap extends _class_IniMap {}
export { IniMap }

import type { Comments as _interface_Comments } from "jsr:@std/ini@0.225.2"
/**
 * Manages comments within the INI file.
 */
interface Comments extends _interface_Comments {}
export type { Comments }

import { parse as _function_parse } from "jsr:@std/ini@0.225.2"
/**
 * Parse an INI config string into an object. Provide formatting options to override the default assignment operator.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/ini/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const parsed = parse(`
 * key = value
 *
 * [section 1]
 * foo = Hello
 * baz = World
 * `);
 *
 * assertEquals(parsed, { key: "value", "section 1": { foo: "Hello", baz: "World" } })
 * ```
 *
 * @example Using custom reviver
 * ```ts
 * import { parse } from "@std/ini/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const parsed = parse(`
 * [section Foo]
 * date = 2012-10-10
 * amount = 12345
 * `, {
 *   reviver(key, value, section) {
 *     if (section === "section Foo") {
 *       if (key === "date") {
 *         return new Date(value);
 *       } else if (key === "amount") {
 *         return +value;
 *       }
 *     }
 *     return value;
 *   }
 * });
 *
 * assertEquals(parsed, {
 *   "section Foo": {
 *     date: new Date("2012-10-10"),
 *     amount: 12345,
 *   }
 * })
 * ```
 *
 * @param text The text to parse
 * @param options The options to use
 * @return The parsed object
 */
const parse = _function_parse as typeof _function_parse
export { parse }

import type { StringifyOptions as _interface_StringifyOptions } from "jsr:@std/ini@0.225.2"
/**
 * Options for constructing INI strings.
 */
interface StringifyOptions extends _interface_StringifyOptions {}
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/ini@0.225.2"
/**
 * Compile an object into an INI config string. Provide formatting options to modify the output.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/ini/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const str = stringify({
 *   key1: "value1",
 *   key2: "value2",
 *   section1: {
 *     foo: "bar",
 *   },
 *   section2: {
 *     hello: "world",
 *   },
 * });
 *
 * assertEquals(str, `key1=value1
 * key2=value2
 * [section1]
 * foo=bar
 * [section2]
 * hello=world`);
 * ```
 *
 * @example Using replacer option
 * ```ts
 * import { stringify } from "@std/ini/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const str = stringify({
 *   "section X": {
 *     date: new Date("2024-06-10"),
 *   },
 *   "section Y": {
 *     name: "John"
 *   }
 * }, {
 *   replacer(key, value, section) {
 *     if (section === "section X" && key === "date") {
 *       return value.toISOString().slice(0, 10);
 *     }
 *     return value;
 *   },
 * });
 *
 * assertEquals(str, `[section X]
 * date=2024-06-10
 * [section Y]
 * name=John`);
 * ```
 *
 * @param object The object to stringify
 * @param options The option to use
 * @return The INI string
 */
const stringify = _function_stringify as typeof _function_stringify
export { stringify }
