// deno-lint-ignore-file no-console
// Imports
import { parseArgs } from "@std/cli"
import { gray, green, red, yellow } from "@std/fmt/colors"
import { basename, dirname, extname, join, relative, resolve, toFileUrl } from "@std/path"
import { generate, generateTables } from "./generator.ts"
import { assert } from "@std/assert"

const args = parseArgs(Deno.args, { string: ["output", "_"], boolean: ["help", "ignore-errors", "check", "table"], alias: { o: "output", h: "help" } })
if (args.help) {
  console.error(`Usage: deno run --allow-read --allow-write --ignore-env [--allow-run=deno] jsr:@libs/database/generate [options] file.sql [file.sql ...]`)
  console.error(``)
  console.error(`Generates typed database queries from annotated SQL files.`)
  console.error(`Each input produces an adjacent .gen.ts file.`)
  console.error(``)
  console.error(``)
  console.error(`Options:`)
  console.error(`  -o, --output=FILE    Combine all inputs into a single .gen.ts file`)
  console.error(`  -h, --help           Show this help message`)
  console.error(`      --table          Generate table/index creation queries from exported TypeScript schemas`)
  console.error(`      --check          Type-check generated files (requires run permission for Deno)`)
  console.error(`      --ignore-errors  Continue processing other files if an error occurs`)
  console.error(``)
  console.error(`Examples:`)
  console.error(`  deno run --allow-read --allow-write --ignore-env jsr:@libs/database/generate users.sql projects.sql`)
  console.error(`  deno run --allow-read --allow-write --ignore-env jsr:@libs/database/generate -o queries.gen.ts users.sql projects.sql`)
  Deno.exit(2)
}

// Prepare the queue of files to be processed
const files = args._.map(String)
assert(files.length > 0, "Expected one or more SQL input files")
const queue = files.map((file) => [[file], join(dirname(file), `${basename(file, extname(file))}.gen.ts`)] as [string[], string])
if (args.output) {
  if (!args.output.endsWith(".gen.ts"))
    args.output = `${args.output}.gen.ts`
  queue.length = 0
  queue.push([files, args.output])
}

// Generate the output files
const outputs = [] as string[]
for (const [files, output] of queue) {
  if (files.some((file) => resolve(file) === resolve(output)))
    throw new TypeError("The generated output must not overwrite an SQL input file")
  const sources = args.table ? [] : await Promise.all(files.map(async (file) => {
    console.error(gray(`→ ${file}`))
    const source = await Deno.readTextFile(file)
    return source.replace(/^(\s*--\s*@import\s+.+?\s+from\s+)(["'])(\.[^"']+)\2/gm, (_match, prefix: string, quote: string, path: string) => {
      const target = relative(dirname(resolve(output)), resolve(dirname(file), path)).replaceAll("\\", "/")
      return `${prefix}${quote}${target.startsWith(".") ? target : `./${target}`}${quote}`
    })
  }))
  try {
    const declarations = {} as Record<string, unknown>
    if (args.table) {
      for (const file of files) {
        console.error(gray(`→ ${file}`))
        const exports = await import(toFileUrl(resolve(file)).href)
        for (const [name, schema] of Object.entries(exports)) {
          if (Object.hasOwn(declarations, name))
            throw new SyntaxError(`Duplicate schema export: ${name}`)
          declarations[name] = schema
        }
      }
    }
    await Deno.writeTextFile(output, args.table ? await generateTables(declarations) : await generate(sources))
    outputs.push(output)
    console.error(green(`✓ ${output}`))
  } catch (error) {
    if (args["ignore-errors"]) {
      console.error(yellow(`✗ ${output}`))
      continue
    }
    console.error(red(`✗ ${output}`))
    throw error
  }
}

// Check generated modules
if (args.check && outputs.length) {
  const command = Deno.execPath()
  const permission = await Deno.permissions.query({ name: "run", command })
  if (permission.state !== "denied") {
    const result = await new Deno.Command(command, { args: ["check", ...outputs], stdout: "inherit", stderr: "inherit" }).output()
    if (!result.success)
      throw new TypeError("Generated database queries failed type checking")
  } else {
    console.error(yellow("⚠ Skipping --check: rerun with --allow-run=deno"))
  }
}
