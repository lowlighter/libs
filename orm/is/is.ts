// Imports
import { z as is } from "npm:zod@3"
import { type ErrorMessageOptions, generateErrorMessage } from "npm:zod-error@1"

/** Original methods. */
const { parse, parseAsync } = is.ZodType.prototype

/** Error formatter. */
const format = {
  prefix: "Validation failed\n  - ",
  code: {
    enabled: true,
    label: null,
    transform: ({ value }) => `[${value.toLocaleUpperCase()}]`,
  },
  delimiter: {
    component: " ",
    error: "\n  - ",
  },
  message: {
    enabled: true,
    label: null,
    transform: ({ value }) => value.toLocaleLowerCase(),
  },
  path: {
    enabled: true,
    label: null,
    type: "objectNotation",
  },
} as ErrorMessageOptions

/** Zod parse override. */
is.ZodType.prototype.parse = function (...args: Parameters<typeof parse>) {
  try {
    return parse.apply(this, args)
  } catch (error) {
    if (error instanceof is.ZodError) {
      // deno-lint-ignore no-ex-assign
      error = new TypeError(generateErrorMessage(error.issues, format))
    }
    throw error
  }
}

/** Zod parseAsync override. */
is.ZodType.prototype.parseAsync = async function (...args: Parameters<typeof parseAsync>) {
  try {
    return await parseAsync.apply(this, args)
  } catch (error) {
    if (error instanceof is.ZodError) {
      // deno-lint-ignore no-ex-assign
      error = new TypeError(generateErrorMessage(error.issues, format))
    }
    throw error
  }
}

/** Input validation. */
export { is }
