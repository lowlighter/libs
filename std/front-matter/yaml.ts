import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@1.0.1/yaml"
/**
 * Return type for {@linkcode extract} function.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }

import { extract as _function_extract } from "jsr:@std/front-matter@1.0.1/yaml"
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
const extract = _function_extract
export { extract }
