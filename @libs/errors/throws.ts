/** Throw an error from an expression. */
export function throws(error: Error | string = new Error()): never {
  throw typeof error === "string" ? new Error(error) : error
}
