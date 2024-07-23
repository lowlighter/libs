import type { Format as _typeAlias_Format } from "jsr:@std/front-matter@0.224.3/test"
/**
 * Supported format for front matter. `"unknown"` is used when auto format
 * detection logic fails.
 */
type Format = _typeAlias_Format
export type { Format }

import { test as _function_test } from "jsr:@std/front-matter@0.224.3/test"
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
