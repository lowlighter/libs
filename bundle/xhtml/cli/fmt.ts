/**
 * CLI utility to format HTML and XML files
 *
 * Can also be used to check if files are formatted using the `--check` flag
 *
 * @module
 */

// Imports
import { expandGlob } from "@std/fs"
import { assertEquals } from "@std/assert"
import { green, red, yellow } from "@std/fmt/colors"
import { parseArgs } from "@std/cli"
import * as XML from "@libs/xml"

const { help, check, root = ".", exclude, unstable, _: globs } = parseArgs(Deno.args, {
  boolean: ["help", "check", "unstable"],
  alias: { help: "h", check: "c", exclude: "e", root: "r" },
  string: ["root", "exclude"],
  collect: ["exclude"],
})
if (help) {
  console.log("XHTML formatter")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-write fmt.ts [options] [files...=**/*.html **/*.xml]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help         Show this help")
  console.log("  -c, --check        Check if files are formatted, exit with non-zero status if not")
  console.log("  -e, --exclude      Exclude files matching glob pattern (can be used multiple times)")
  console.log("  [-r, --root=.]     Root directory to search for files")
  console.log("")
  console.log("  --unstable         Bypass check for unstable features")
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
if ((!unstable) && (!check)) {
  console.error(yellow("Warning: this formatter is not stable yet. It may break your HTML and XML documents in some cases (mainly the order of children may change and comments might be removed too). Please pass --unstable flag if you still want to proceed."))
  Deno.exit(1)
}
if (!globs.length) {
  globs.push("**/*.html", "**/*.xml")
}

const checked = new Set<string>()
let errored = 0
for (const glob of globs) {
  for await (const { path } of expandGlob(`${glob}`, { root, exclude })) {
    checked.add(path)
    const content = await Deno.readTextFile(path)
    const formatted = XML.stringify(XML.parse(content))
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
