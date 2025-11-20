// Imports
import { Logger } from "@libs/logger"
import { fromFileUrl } from "jsr:@std/path@^1.1.2"

// Download vendored esbuild files
const logger = new Logger()
for (const file of ["wasm.js", "esbuild.wasm"]) {
  logger.with({file}).debug()
  const path = fromFileUrl(import.meta.resolve(`../vendored/esbuild/${file}`))
  await fetch(`https://deno.land/x/esbuild/${file}`).then(async response => await Deno.writeTextFile(path, (await response.text()).replace("/// <reference types=\"./wasm.d.ts\" />\n", "")))
  logger.with({file, path}).ok()
}