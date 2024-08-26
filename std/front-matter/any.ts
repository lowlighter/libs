import type { Extract as _typeAlias_Extract } from "jsr:@std/front-matter@1.0.2/any"
/**
 * Return type for {@linkcode extract} function.
 */
type Extract<T> = _typeAlias_Extract<T>
export type { Extract }

import { extract as _function_extract } from "jsr:@std/front-matter@1.0.2/any"
/**
 * Extracts and parses {@link https://yaml.org | YAML}, {@link https://toml.io |
 * TOML}, or {@link https://www.json.org/ | JSON} from the metadata of front
 * matter content, depending on the format.
 *
 * @example ```ts
 * import { extract } from "@std/front-matter/any";
 *
 * const output = `---json
 * {
 *   "title": "Three dashes marks the spot"
 * }
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * result.frontMatter; // '{\n "title": "Three dashes marks the spot"\n}'
 * result.body; // "Hello, world!"
 * result.attrs; // { title: "Three dashes marks the spot" }
 * ```
 *
 * @template T The type of the parsed front matter.
 * @param text The text to extract front matter from.
 * @return The extracted front matter and body content.
 */
const extract = _function_extract as typeof _function_extract
export { extract }
