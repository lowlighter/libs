/**
 * CLI utility to build WASM projects
 *
 * @module
 */

// Imports
import { bundle } from "../bundle.ts"
import { parseArgs } from "@std/cli"
import { Logger, type loglevel } from "@libs/logger"

let { help, ["auto-install"]: autoinstall, bin, banner, loglevel, _: [project] } = parseArgs(Deno.args, {
  boolean: ["help", "auto-install"],
  alias: { help: "h", "auto-install": "i", bin: "x", banner: "b", loglevel: "l" },
  string: ["bin", "banner", "loglevel"],
})
if (help) {
  console.log("WASM bundler")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-net --allow-env --allow-write --allow-run build.ts [options] [project]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                  Show this help")
  console.log("  -l, --loglevel=[log]                        Log level (disabled, debug, log, info, warn, error)")
  console.log("  -b, --banner                                Add a banner to output")
  console.log("  [-x, --bin=wasm-pack]                       Binary name or path for wasm-pack")
  console.log("  [-i, --auto-install=$(Deno.env.get('CI'))]  Automatically download and install wasm-pack if not found")
  console.log("")
  Deno.exit(0)
}

if ((Deno.permissions.querySync({ name: "env", variable: "CI" }).state === "granted") && (Deno.env.get("CI"))) {
  autoinstall ??= true
}
await bundle(`${project || Deno.cwd()}`, { bin, banner, autoinstall, loglevel: Logger.level[loglevel as loglevel] })
