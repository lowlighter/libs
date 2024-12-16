// Imports
import { Logger } from "@libs/logger"
import { fromFileUrl } from "@std/path"

// Download vendored esbuild files
const logger = new Logger()
for (const file of ["wasm.js", "wasm.d.ts", "esbuild.wasm"]) {
  logger.with({file}).debug()
  const path = fromFileUrl(import.meta.resolve(`../vendored/esbuild/${file}`))
  await fetch(`https://deno.land/x/esbuild/${file}`).then(async response => await Deno.writeTextFile(path, await response.text()))
  logger.with({file, path}).ok()
}