/**
 * CLI utility to build WASM projects
 *
 * @module
 */

// Imports
import { bundle } from "../bundle.ts"
import { parseArgs } from "@std/cli"

let { help, ["auto-install"]: autoinstall, bin, cwd, banner, _: [project] } = parseArgs(Deno.args, { boolean: ["auto-install"], alias: { help: "h", "auto-install": "i", bin: "x", cwd: "p", banner: "b" }, string: ["bin", "cwd", "banner"] })
if (help) {
  console.log("WASM bundler")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-run=wasm-pack --allow-net=github.com,api.github.com,objects.githubusercontent.com --allow-write=<TMP> build.ts [options] <project>")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                  Show this help")
  console.log("  -b, --banner                                Add a banner to output")
  console.log("  [-p, --cwd=$(Deno.cwd())]                   Rust current working directory (should be at same level as Cargo.toml)")
  console.log("  [-x, --bin=wasm-pack]                       Binary name or path for wasm-pack")
  console.log("  [-i, --auto-install=$(Deno.env.get('CI'))]  Automatically download and install wasm-pack if not found")
  console.log("")
  Deno.exit(0)
}

cwd ??= Deno.cwd()
if ((Deno.permissions.querySync({ name: "env", variable: "CI" }).state === "granted") && (Deno.env.get("CI"))) {
  autoinstall ??= true
}
await bundle(`${project}`, { bin, cwd, banner, autoinstall })
