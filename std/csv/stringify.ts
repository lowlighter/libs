import type { PropertyAccessor as _typeAlias_PropertyAccessor } from "jsr:@std/csv@1.0.2/stringify"
/**
 * Array index or record key corresponding to a value for a data object.
 */
type PropertyAccessor = _typeAlias_PropertyAccessor
export type { PropertyAccessor }

import type { ColumnDetails as _typeAlias_ColumnDetails } from "jsr:@std/csv@1.0.2/stringify"
/**
 * Column information.
 *
 * @param header Explicit column header name. If omitted,
 * the (final) property accessor is used for this value.
 *
 * @param prop Property accessor(s) used to access the value on the object
 */
type ColumnDetails = _typeAlias_ColumnDetails
export type { ColumnDetails }

import type { Column as _typeAlias_Column } from "jsr:@std/csv@1.0.2/stringify"
/**
 * The most essential aspect of a column is accessing the property holding the
 * data for that column on each object in the data array. If that member is at
 * the top level, `Column` can simply be a property accessor, which is either a
 * `string` (if it's a plain object) or a `number` (if it's an array).
 *
 * ```ts
 * const columns = [
 *   "name",
 * ];
 * ```
 *
 * Each property accessor will be used as the header for the column:
 *
 * | name |
 * | :--: |
 * | Deno |
 *
 * - If the required data is not at the top level (it's nested in other
 *   objects/arrays), then a simple property accessor won't work, so an array of
 *   them will be required.
 *
 *   ```ts
 *   const columns = [
 *     ["repo", "name"],
 *     ["repo", "org"],
 *   ];
 *   ```
 *
 *   When using arrays of property accessors, the header names inherit the value
 *   of the last accessor in each array:
 *
 *   | name |   org    |
 *   | :--: | :------: |
 *   | deno | denoland |
 *
 *  - If a different column header is desired, then a `ColumnDetails` object type
 *     can be used for each column:
 *
 *   - **`header?: string`** is the optional value to use for the column header
 *     name
 *
 *   - **`prop: PropertyAccessor | PropertyAccessor[]`** is the property accessor
 *     (`string` or `number`) or array of property accessors used to access the
 *     data on each object
 *
 *   ```ts
 *   const columns = [
 *     "name",
 *     {
 *       prop: ["runsOn", 0],
 *       header: "language 1",
 *     },
 *     {
 *       prop: ["runsOn", 1],
 *       header: "language 2",
 *     },
 *   ];
 *   ```
 *
 *   | name | language 1 | language 2 |
 *   | :--: | :--------: | :--------: |
 *   | Deno |    Rust    | TypeScript |
 */
type Column = _typeAlias_Column
export type { Column }

import type { DataItem as _typeAlias_DataItem } from "jsr:@std/csv@1.0.2/stringify"
/**
 * An object (plain or array)
 */
type DataItem = _typeAlias_DataItem
export type { DataItem }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/csv@1.0.2/stringify"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/csv@1.0.2/stringify"
/**
 * Converts an array of objects into a CSV string.
 *
 * @example Default options
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * assertEquals(stringify(data), `Rick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @example Give an array of objects and specify columns
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = ["name", "age"];
 *
 * assertEquals(stringify(data, { columns }), `name,age\r\nRick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @example Give an array of objects without specifying columns
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertThrows } from "@std/assert/throws";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * assertThrows(
 *   () => stringify(data),
 *   TypeError,
 *   "No property accessor function was provided for object",
 * );
 * ```
 *
 * @example Give an array of objects and specify columns with `headers: false`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = ["name", "age"];
 *
 * assertEquals(
 *   stringify(data, { columns, headers: false }),
 *  `Rick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects and specify columns with renaming
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = [
 *   { prop: "name", header: "user name" },
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `user name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects with nested property and specify columns
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   {
 *     age: 70,
 *     name: {
 *       first: "Rick",
 *       last: "Sanchez",
 *     },
 *   },
 *   {
 *     age: 14,
 *     name: {
 *       first: "Morty",
 *       last: "Smith",
 *     },
 *   },
 * ];
 *
 * const columns: Column[] = [
 *   ["name", "first"],
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `first,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects with nested property and specify columns
 * with renaming
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   {
 *     age: 70,
 *     name: {
 *       first: "Rick",
 *       last: "Sanchez",
 *     },
 *   },
 *   {
 *     age: 14,
 *     name: {
 *       first: "Morty",
 *       last: "Smith",
 *     },
 *   },
 * ];
 *
 * const columns: Column[] = [
 *   { prop: ["name", "first"], header: "first name" },
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `first name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of string arrays and specify columns with renaming
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * const columns = [
 *   { prop: 0, header: "name" },
 *   { prop: 1, header: "age" },
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Emit TSV (tab-separated values) with `separator: "\t"`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * assertEquals(stringify(data, { separator: "\t" }), `Rick\t70\r\nMorty\t14\r\n`);
 * ```
 *
 * @example Prepend a byte-order mark with `bom: true`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [["Rick", 70]];
 *
 * assertEquals(stringify(data, { bom: true }), "\ufeffRick,70\r\n");
 * ```
 *
 * @param data The source data to stringify. It's an array of items which are
 * plain objects or arrays.
 * @param options Options for the stringification.
 * @return A CSV string.
 */
const stringify = _function_stringify as typeof _function_stringify
export { stringify }
