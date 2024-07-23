import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@0.224.3/create-extractor"
/**
 * Return type for {@linkcode Extractor}.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }

import type { Extractor as _typeAlias_Extractor } from "jsr:@std/front-matter@0.224.3/create-extractor"
/**
 * Function return type for {@linkcode createExtractor}.
 */
type Extractor = _typeAlias_Extractor
export type { Extractor }

import type { Parser as _typeAlias_Parser } from "jsr:@std/front-matter@0.224.3/create-extractor"
/**
 * Parser function type used alongside {@linkcode createExtractor}.
 */
type Parser = _typeAlias_Parser
export type { Parser }

import { createExtractor as _function_createExtractor } from "jsr:@std/front-matter@0.224.3/create-extractor"
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
