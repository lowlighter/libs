import type { LoadOptions as _interface_LoadOptions } from "jsr:@std/dotenv@0.225.2"
/**
 * Options for {@linkcode load} and {@linkcode loadSync}.
 */
interface LoadOptions extends _interface_LoadOptions {}
export type { LoadOptions }

import { loadSync as _function_loadSync } from "jsr:@std/dotenv@0.225.2"
/**
 * Works identically to {@linkcode load}, but synchronously.
 *
 * @example Usage
 * ```ts no-eval
 * import { loadSync } from "@std/dotenv";
 *
 * const conf = loadSync();
 * ```
 *
 * @param options Options for loading the environment variables.
 * @return The parsed environment variables.
 */
const loadSync = _function_loadSync as typeof _function_loadSync
export { loadSync }

import { load as _function_load } from "jsr:@std/dotenv@0.225.2"
/**
 * Load environment variables from a `.env` file.  Loaded variables are accessible
 * in a configuration object returned by the `load()` function, as well as optionally
 * exporting them to the process environment using the `export` option.
 *
 * Inspired by the node modules {@linkcode https://github.com/motdotla/dotenv | dotenv}
 * and {@linkcode https://github.com/motdotla/dotenv-expand | dotenv-expand}.
 *
 * Note: The key needs to match the pattern /^[a-zA-Z_][a-zA-Z0-9_]*$/.
 *
 * ## Basic usage
 * ```sh
 * # .env
 * GREETING=hello world
 * ```
 *
 * Then import the environment variables using the `load` function.
 *
 * @example Basic usage
 * ```ts no-eval
 * // app.ts
 * import { load } from "@std/dotenv";
 *
 * console.log(await load({ export: true })); // { GREETING: "hello world" }
 * console.log(Deno.env.get("GREETING")); // hello world
 * ```
 *
 * Run this with `deno run --allow-read --allow-env app.ts`.
 *
 * .env files support blank lines, comments, multi-line values and more.
 * See Parsing Rules below for more detail.
 *
 * ## Auto loading
 * Import the `load.ts` module to auto-import from the `.env` file and into
 * the process environment.
 *
 * @example Auto-loading
 * ```ts no-eval
 * // app.ts
 * import "@std/dotenv/load";
 *
 * console.log(Deno.env.get("GREETING")); // hello world
 * ```
 *
 * Run this with `deno run --allow-read --allow-env app.ts`.
 *
 * ## Files
 * Dotenv supports a number of different files, all of which are optional.
 * File names and paths are configurable.
 *
 * |File|Purpose|
 * |----|-------|
 * |.env|primary file for storing key-value environment entries
 *
 * ## Configuration
 *
 * Loading environment files comes with a number of options passed into
 * the `load()` function, all of which are optional.
 *
 * |Option|Default|Description
 * |------|-------|-----------
 * |envPath|./.env|Path and filename of the `.env` file.  Use null to prevent the .env file from being loaded.
 * |export|false|When true, this will export all environment variables in the `.env` file to the process environment (e.g. for use by `Deno.env.get()`) but only if they are not already set.  If a variable is already in the process, the `.env` value is ignored.
 *
 * ### Example configuration
 *
 * @example Using with options
 * ```ts no-eval
 * import { load } from "@std/dotenv";
 *
 * const conf = await load({
 *   envPath: "./.env_prod", // Uses .env_prod instead of .env
 *   export: true, // Exports all variables to the environment
 * });
 * ```
 *
 * ## Permissions
 *
 * At a minimum, loading the `.env` related files requires the `--allow-read` permission.  Additionally, if
 * you access the process environment, either through exporting your configuration or expanding variables
 * in your `.env` file, you will need the `--allow-env` permission.  E.g.
 *
 * ```sh
 * deno run --allow-read=.env --allow-env=ENV1,ENV2 app.ts
 * ```
 *
 * ## Parsing Rules
 *
 * The parsing engine currently supports the following rules:
 *
 * - Variables that already exist in the environment are not overridden with
 *   `export: true`
 * - `BASIC=basic` becomes `{ BASIC: "basic" }`
 * - empty lines are skipped
 * - lines beginning with `#` are treated as comments
 * - empty values become empty strings (`EMPTY=` becomes `{ EMPTY: "" }`)
 * - single and double quoted values are escaped (`SINGLE_QUOTE='quoted'` becomes
 *   `{ SINGLE_QUOTE: "quoted" }`)
 * - new lines are expanded in double quoted values (`MULTILINE="new\nline"`
 *   becomes
 *
 * ```
 * { MULTILINE: "new\nline" }
 * ```
 *
 * - inner quotes are maintained (think JSON) (`JSON={"foo": "bar"}` becomes
 *   `{ JSON: "{\"foo\": \"bar\"}" }`)
 * - whitespace is removed from both ends of unquoted values (see more on
 *   {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim | trim})
 *   (`FOO= some value` becomes `{ FOO: "some value" }`)
 * - whitespace is preserved on both ends of quoted values (`FOO=" some value "`
 *   becomes `{ FOO: " some value " }`)
 * - dollar sign with an environment key in or without curly braces in unquoted
 *   values will expand the environment key (`KEY=$KEY` or `KEY=${KEY}` becomes
 *   `{ KEY: "<KEY_VALUE_FROM_ENV>" }`)
 * - escaped dollar sign with an environment key in unquoted values will escape the
 *   environment key rather than expand (`KEY=\$KEY` becomes `{ KEY: "\\$KEY" }`)
 * - colon and a minus sign with a default value(which can also be another expand
 *   value) in expanding construction in unquoted values will first attempt to
 *   expand the environment key. If it’s not found, then it will return the default
 *   value (`KEY=${KEY:-default}` If KEY exists it becomes
 *   `{ KEY: "<KEY_VALUE_FROM_ENV>" }` If not, then it becomes
 *   `{ KEY: "default" }`. Also there is possible to do this case
 *   `KEY=${NO_SUCH_KEY:-${EXISTING_KEY:-default}}` which becomes
 *   `{ KEY: "<EXISTING_KEY_VALUE_FROM_ENV>" }`)
 *
 * @param options The options
 * @return The parsed environment variables
 */
const load = _function_load as typeof _function_load
export { load }

import { stringify as _function_stringify } from "jsr:@std/dotenv@0.225.2"
/**
 * Stringify an object into a valid `.env` file format.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/dotenv/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const object = { GREETING: "hello world" };
 * assertEquals(stringify(object), "GREETING='hello world'");
 * ```
 *
 * @param object object to be stringified
 * @return string of object
 */
const stringify = _function_stringify as typeof _function_stringify
export { stringify }

import { parse as _function_parse } from "jsr:@std/dotenv@0.225.2"
/**
 * Parse `.env` file output in an object.
 *
 * Note: The key needs to match the pattern /^[a-zA-Z_][a-zA-Z0-9_]*$/.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/dotenv/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const env = parse("GREETING=hello world");
 * assertEquals(env, { GREETING: "hello world" });
 * ```
 *
 * @param text The text to parse.
 * @return The parsed object.
 */
const parse = _function_parse as typeof _function_parse
export { parse }
