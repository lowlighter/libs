// Imports
import { is } from "@libs/is"

/** Options accepting undefined while producing a required default value. */
export const Options = is.object({
  value: is.number().default(1),
}).prefault(() => ({}))

/** Nested defaults are also resolved before SQL execution. */
export const Nested = is.object({
  options: Options,
}).prefault(() => ({}))

/** Schema transforms change the execution value's type. */
export const Converted = is.object({
  value: is.string().transform((value) => value.length),
})
