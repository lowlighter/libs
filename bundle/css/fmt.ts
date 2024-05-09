/**
 * CLI utility to format CSS files
 *
 * Can also be used to check if files are formatted using the `--check` flag
 *
 * @module
 */

// Imports
import { bundle } from "./bundle.ts"
import { expandGlob } from "jsr:@std/fs@0.224.0"
import { assertEquals } from "jsr:@std/assert@0.224.0"
import { green, red } from "jsr:@std/fmt@0.224.0/colors"
import { parseArgs } from "jsr:@std/cli@0.224.0"

const { check, help, root = ".", exclude, _: globs } = parseArgs(Deno.args, { boolean: ["check", "help"], alias: { help: "h", check: "c", exclude: "e", root: "r" }, string: ["root"], collect: ["exclude"] })
if (help) {
  console.log("CSS formatter")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-sys --allow-env --allow-write fmt.ts [options] [files...=**/*.css]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help         Show this help")
  console.log("  -c, --check        Check if files are formatted, exit with non-zero status if not")
  console.log("  -e, --exclude      Exclude files matching glob pattern (can be used multiple times)")
  console.log("  [-r, --root=.]     Root directory to search for files")
  console.log("")
  console.log("Examples:")
  console.log("")
  console.log("  Check if all files are formatted:")
  console.log("    deno --allow-read --allow-sys --allow-env fmt.ts")
  console.log("")
  console.log("  Format all files (requires --allow-write):")
  console.log("    deno --allow-read --allow-sys --allow-env --allow-write fmt.ts --check")
  console.log("")
  Deno.exit(0)
}
if (!globs.length) {
  globs.push("**/*.css")
}
const checked = new Set<string>()
let errored = 0
for (const glob of globs) {
  for await (const { path } of expandGlob(`${glob}`, { root, exclude: exclude?.map((excluded) => `${excluded}`) })) {
    checked.add(path)
    const content = await Deno.readTextFile(path)
    const formatted = await bundle(content, { rules: { "no-descending-specificity": false } })
    if (check) {
      try {
        assertEquals(content, formatted)
      } catch (error) {
        console.log(error.message)
        errored++
      }
      continue
    }
    if (formatted !== content) {
      await Deno.writeTextFile(path, formatted)
      console.log(path)
    }
  }
}
if (errored) {
  console.log(red(`${errored} file(s) not formatted`))
  Deno.exit(1)
}
console.log(green(`${checked.size} file(s) checked`))
