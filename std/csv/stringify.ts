import type { PropertyAccessor as _typeAlias_PropertyAccessor } from "jsr:@std/csv@0.224.3/stringify"
/**
 * Array index or record key corresponding to a value for a data object.
 */
type PropertyAccessor = _typeAlias_PropertyAccessor
export type { PropertyAccessor }

import type { ColumnDetails as _typeAlias_ColumnDetails } from "jsr:@std/csv@0.224.3/stringify"
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

import type { Column as _typeAlias_Column } from "jsr:@std/csv@0.224.3/stringify"
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

import type { DataItem as _typeAlias_DataItem } from "jsr:@std/csv@0.224.3/stringify"
/**
 * An object (plain or array)
 */
type DataItem = _typeAlias_DataItem
export type { DataItem }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/csv@0.224.3/stringify"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { StringifyError as _class_StringifyError } from "jsr:@std/csv@0.224.3/stringify"
/**
 * Error thrown in {@linkcode stringify}.
 *
 * @example Usage
 * ```ts no-assert
 * import { stringify, StringifyError } from "@std/csv/stringify";
 *
 * try {
 *   stringify([{ a: 1 }, { a: 2 }], { separator: "\r\n" });
 * } catch (error) {
 *   if (error instanceof StringifyError) {
 *     console.error(error.message);
 *   }
 * }
 * ```
 */
class StringifyError extends _class_StringifyError {}
export { StringifyError }

import { stringify as _function_stringify } from "jsr:@std/csv@0.224.3/stringify"
/**
 * Converts an array of objects into a CSV string.
 *
 * @example Usage
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * type Character = {
 *   age: number;
 *   name: {
 *     first: string;
 *     last: string;
 *   };
 * };
 *
 * const data: Character[] = [
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
 * let columns: Column[] = [
 *   ["name", "first"],
 *   "age",
 * ];
 *
 * assertEquals(stringify(data, { columns }), `first,age\r\nRick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @param data The source data to stringify. It's an array of items which are
 * plain objects or arrays.
 * @return A CSV string.
 */
const stringify = _function_stringify
export { stringify }
