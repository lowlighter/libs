import { extractJson as _variable_extractJson } from "jsr:@std/front-matter@0.224.3"
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
 * {
 *   "title": "Three dashes marks the spot"
 * }
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: '{\n  "title": "Three dashes marks the spot"\n}',
 *   body: "Hello, world!",
 *   attrs: { title: "Three dashes marks the spot" },
 * });
 * ```
 */
const extractJson = _variable_extractJson
export { extractJson }

import { extractToml as _variable_extractToml } from "jsr:@std/front-matter@0.224.3"
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
 */
const extractToml = _variable_extractToml
export { extractToml }

import { extractYaml as _variable_extractYaml } from "jsr:@std/front-matter@0.224.3"
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
 */
const extractYaml = _variable_extractYaml
export { extractYaml }

import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@0.224.3"
/**
 * Return type for {@linkcode Extractor}.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }

import type { Extractor as _typeAlias_Extractor } from "jsr:@std/front-matter@0.224.3"
/**
 * Function return type for {@linkcode createExtractor}.
 */
type Extractor = _typeAlias_Extractor
export type { Extractor }

import type { Parser as _typeAlias_Parser } from "jsr:@std/front-matter@0.224.3"
/**
 * Parser function type used alongside {@linkcode createExtractor}.
 */
type Parser = _typeAlias_Parser
export type { Parser }

import { createExtractor as _function_createExtractor } from "jsr:@std/front-matter@0.224.3"
/**
 * Factory that creates a function that extracts front matter from a string with
 * the given parsers. Supports {@link https://yaml.org | YAML},
 * {@link https://toml.io | TOML} and {@link https://www.json.org/ | JSON}.
 *
 * For simple use cases where you know which format to parse in advance, use the
 * pre-built extractors:
 *
 * - {@linkcode https://jsr.io/@std/front-matter/doc/yaml/~/extract | extractYaml}
 * - {@linkcode https://jsr.io/@std/front-matter/doc/toml/~/extract | extractToml}
 * - {@linkcode https://jsr.io/@std/front-matter/doc/json/~/extract | extractJson}
 *
 * @param formats A descriptor containing Format-parser pairs to use for each format.
 * @return A function that extracts front matter from a string with the given parsers.
 *
 * @example Extract YAML front matter
 * ```ts
 * import { createExtractor, Parser } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 * import { parse as parseYaml } from "@std/yaml/parse";
 *
 * const extractYaml = createExtractor({ yaml: parseYaml as Parser });
 * const { attrs, body, frontMatter } = extractYaml<{ title: string }>(
 * `---
 * title: Three dashes marks the spot
 * ---
 * ferret`);
 * assertEquals(attrs.title, "Three dashes marks the spot");
 * assertEquals(body, "ferret");
 * assertEquals(frontMatter, "title: Three dashes marks the spot");
 * ```
 *
 * @example Extract TOML front matter
 * ```ts
 * import { createExtractor, Parser } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 * import { parse as parseToml } from "@std/toml/parse";
 *
 * const extractToml = createExtractor({ toml: parseToml as Parser });
 * const { attrs, body, frontMatter } = extractToml<{ title: string }>(
 * `---toml
 * title = 'Three dashes followed by format marks the spot'
 * ---
 * `);
 * assertEquals(attrs.title, "Three dashes followed by format marks the spot");
 * assertEquals(body, "");
 * assertEquals(frontMatter, "title = 'Three dashes followed by format marks the spot'");
 * ```
 *
 * @example Extract JSON front matter
 * ```ts
 * import { createExtractor, Parser } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 *
 * const extractJson = createExtractor({ json: JSON.parse as Parser });
 * const { attrs, body, frontMatter } = extractJson<{ title: string }>(
 * `---json
 * {"title": "Three dashes followed by format marks the spot"}
 * ---
 * goat`);
 * assertEquals(attrs.title, "Three dashes followed by format marks the spot");
 * assertEquals(body, "goat");
 * assertEquals(frontMatter, `{"title": "Three dashes followed by format marks the spot"}`);
 * ```
 *
 * @example Extract YAML or JSON front matter
 * ```ts
 * import { createExtractor, Parser } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 * import { parse as parseYaml } from "@std/yaml/parse";
 *
 * const extractYamlOrJson = createExtractor({
 *   yaml: parseYaml as Parser,
 *   json: JSON.parse as Parser,
 * });
 *
 * let { attrs, body, frontMatter } = extractYamlOrJson<{ title: string }>(
 * `---
 * title: Three dashes marks the spot
 * ---
 * ferret`);
 * assertEquals(attrs.title, "Three dashes marks the spot");
 * assertEquals(body, "ferret");
 * assertEquals(frontMatter, "title: Three dashes marks the spot");
 *
 * ({ attrs, body, frontMatter } = extractYamlOrJson<{ title: string }>(
 * `---json
 * {"title": "Three dashes followed by format marks the spot"}
 * ---
 * goat`));
 * assertEquals(attrs.title, "Three dashes followed by format marks the spot");
 * assertEquals(body, "goat");
 * assertEquals(frontMatter, `{"title": "Three dashes followed by format marks the spot"}`);
 * ```
 */
const createExtractor = _function_createExtractor
export { createExtractor }

import type { Format as _typeAlias_Format } from "jsr:@std/front-matter@0.224.3"
/**
 * Supported format for front matter. `"unknown"` is used when auto format
 * detection logic fails.
 */
type Format = _typeAlias_Format
export type { Format }

import { test as _function_test } from "jsr:@std/front-matter@0.224.3"
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
const test = _function_test
export { test }
