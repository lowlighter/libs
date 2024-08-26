import { extractJson as _function_extractJson } from "jsr:@std/front-matter@1.0.2"
/**
 * Extracts and parses {@link https://www.json.org/ | JSON } from the metadata
 * of front matter content.
 *
 * @example Extract JSON front matter
 * ```ts
 * import { extract } from "@std/front-matter/json";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---json
 * { "title": "Three dashes marks the spot" }
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: '{ "title": "Three dashes marks the spot" }',
 *   body: "Hello, world!",
 *   attrs: { title: "Three dashes marks the spot" },
 * });
 * ```
 *
 * @template T The type of the parsed front matter.
 * @param text The text to extract JSON front matter from.
 * @return The extracted JSON front matter and body content.
 */
const extractJson = _function_extractJson as typeof _function_extractJson
export { extractJson }

import { extractToml as _function_extractToml } from "jsr:@std/front-matter@1.0.2"
/**
 * Extracts and parses {@link https://toml.io | TOML} from the metadata of
 * front matter content.
 *
 * @example Extract TOML front matter
 * ```ts
 * import { extract } from "@std/front-matter/toml";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---toml
 * title = "Three dashes marks the spot"
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: 'title = "Three dashes marks the spot"',
 *   body: "Hello, world!",
 *   attrs: { title: "Three dashes marks the spot" },
 * });
 * ```
 *
 * @template T The type of the parsed front matter.
 * @param text The text to extract TOML front matter from.
 * @return The extracted TOML front matter and body content.
 */
const extractToml = _function_extractToml as typeof _function_extractToml
export { extractToml }

import { extractYaml as _function_extractYaml } from "jsr:@std/front-matter@1.0.2"
/**
 * Extracts and parses {@link https://yaml.org | YAML} from the metadata of
 * front matter content.
 *
 * @example Extract YAML front matter
 * ```ts
 * import { extract } from "@std/front-matter/yaml";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---yaml
 * title: Three dashes marks the spot
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: "title: Three dashes marks the spot",
 *   body: "Hello, world!",
 *   attrs: { title: "Three dashes marks the spot" },
 * });
 * ```
 *
 * @template T The type of the parsed front matter.
 * @param text The text to extract YAML front matter from.
 * @return The extracted YAML front matter and body content.
 */
const extractYaml = _function_extractYaml as typeof _function_extractYaml
export { extractYaml }

import type { Format as _typeAlias_Format } from "jsr:@std/front-matter@1.0.2"
/**
 * Supported format for front matter. `"unknown"` is used when auto format
 * detection logic fails.
 */
type Format = _typeAlias_Format
export type { Format }

import { test as _function_test } from "jsr:@std/front-matter@1.0.2"
/**
 * Tests if a string has valid front matter.
 * Supports {@link https://yaml.org | YAML}, {@link https://toml.io | TOML} and
 * {@link https://www.json.org/ | JSON}.
 *
 * @param str String to test.
 * @param formats A list of formats to test for. Defaults to all supported formats.
 * @return `true` if the string has valid front matter, otherwise `false`.
 *
 * @example Test for valid YAML front matter
 * ```ts
 * import { test } from "@std/front-matter/test";
 * import { assert } from "@std/assert";
 *
 * const result = test(
 * `---
 * title: Three dashes marks the spot
 * ---
 * `);
 * assert(result);
 * ```
 *
 * @example Test for valid TOML front matter
 * ```ts
 * import { test } from "@std/front-matter/test";
 * import { assert } from "@std/assert";
 *
 * const result = test(
 * `---toml
 * title = 'Three dashes followed by format marks the spot'
 * ---
 * `);
 * assert(result);
 * ```
 *
 * @example Test for valid JSON front matter
 * ```ts
 * import { test } from "@std/front-matter/test";
 * import { assert } from "@std/assert";
 *
 * const result = test(
 * `---json
 * {"title": "Three dashes followed by format marks the spot"}
 * ---
 * `);
 * assert(result);
 * ```
 *
 * @example JSON front matter is not valid as YAML
 * ```ts
 * import { test } from "@std/front-matter/test";
 * import { assertFalse } from "@std/assert";
 *
 * const result = test(
 * `---json
 * {"title": "Three dashes followed by format marks the spot"}
 * ---
 * `, ["yaml"]);
 * assertFalse(result);
 * ```
 */
const test = _function_test as typeof _function_test
export { test }

import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@1.0.2"
/**
 * Return type for {@linkcode extract} function.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }
