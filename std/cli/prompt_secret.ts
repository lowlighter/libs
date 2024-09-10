import type { PromptSecretOptions as _typeAlias_PromptSecretOptions } from "jsr:@std/cli@1.0.5/prompt-secret"
/**
 * Options for {@linkcode promptSecret}.
 */
type PromptSecretOptions = _typeAlias_PromptSecretOptions
export type { PromptSecretOptions }

import { promptSecret as _function_promptSecret } from "jsr:@std/cli@1.0.5/prompt-secret"
/**
 * Shows the given message and waits for the user's input. Returns the user's input as string.
 * This is similar to `prompt()` but it print user's input as `*` to prevent password from being shown.
 * Use an empty `mask` if you don't want to show any character.
 *
 * @param message The prompt message to show to the user.
 * @param options The options for the prompt.
 * @return The string that was entered or `null` if stdin is not a TTY.
 *
 * @example Usage
 * ```ts no-eval
 * import { promptSecret } from "@std/cli/prompt-secret";
 *
 * const password = promptSecret("Please provide the password:");
 * if (password !== "some-password") {
 *   throw new Error("Access denied");
 * }
 * ```
 */
const promptSecret = _function_promptSecret as typeof _function_promptSecret
export { promptSecret }
