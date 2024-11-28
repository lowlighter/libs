// deno-lint-ignore-file no-explicit-any
/** Current runtime name. */
let runtime = "unknown"

if ((globalThis as any).Deno) {
  runtime = "deno"
} else if ((globalThis as any).Bun) {
  runtime = "bun"
} else if ((globalThis as any).process?.versions?.node) {
  runtime = "node"
}

export { runtime }
