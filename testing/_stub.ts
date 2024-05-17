/** Stub function intended as dead-end for other runtimes branches when these are run within a deno context. */
export function test(_name: string, _fn: () => void) {
  throw new Error("Not implemented")
}
