/** TestingError can be used to test expected error behaviours in tests. */
export class TestingError extends Error {}

/** Throws back an error (can be used where statements are not allowed in syntax). */
export function throws(error: Error | string): never {
  if (typeof error === "string") {
    error = new TestingError(error)
  }
  throw error
}