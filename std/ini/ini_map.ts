import type { FormattingOptions as _interface_FormattingOptions } from "jsr:@std/ini@0.225.2/ini-map"
/**
 * Options for providing formatting marks.
 */
interface FormattingOptions extends _interface_FormattingOptions {}
export type { FormattingOptions }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/ini@0.225.2/ini-map"
/**
 * Options for parsing INI strings.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import type { ReplacerFunction as _typeAlias_ReplacerFunction } from "jsr:@std/ini@0.225.2/ini-map"
/**
 * Function for replacing JavaScript values with INI string values.
 */
type ReplacerFunction = _typeAlias_ReplacerFunction
export type { ReplacerFunction }

import type { ReviverFunction as _typeAlias_ReviverFunction } from "jsr:@std/ini@0.225.2/ini-map"
/**
 * Function for replacing INI values with JavaScript values.
 */
type ReviverFunction = _typeAlias_ReviverFunction
export type { ReviverFunction }

import { IniMap as _class_IniMap } from "jsr:@std/ini@0.225.2/ini-map"
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

import type { Comments as _interface_Comments } from "jsr:@std/ini@0.225.2/ini-map"
/**
 * Manages comments within the INI file.
 */
interface Comments extends _interface_Comments {}
export type { Comments }
