import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@1.0.5/unstable-yaml"
/**
 * Return type for {@linkcode extract} function.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }

import { extract as _function_extract } from "jsr:@std/front-matter@1.0.5/unstable-yaml"
/**
 * Extracts and parses {@link https://yaml.org | YAML} from the metadata of
 * front matter content.
 *
 * @experimental
 * @example Extract YAML front matter
 * ```ts
 * import { extract } from "@std/front-matter/unstable-yaml";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---yaml
 * date: 2022-01-01
 * ---
 * Hello, world!`;
 * const result = extract(output, { schema: "json" });
 *
 * assertEquals(result, {
 *   frontMatter: "date: 2022-01-01",
 *   body: "Hello, world!",
 *   attrs: { date: "2022-01-01" },
 * });
 * ```
 *
 * @template T The type of the parsed front matter.
 * @param text The text to extract YAML front matter from.
 * @param options The options to pass to `@std/yaml/parse`.
 * @return The extracted YAML front matter and body content.
 */
const extract = _function_extract as typeof _function_extract
export { extract }
