// deno-lint-ignore-file no-console
import { parseArgs } from "@std/cli"
import { cyan, gray, green, red, stripAnsiCode, yellow } from "@std/fmt/colors"
import { basename, join } from "@std/path"
import { exists } from "@std/fs"

const decoder = new TextDecoder()
const args = parseArgs(Deno.args, { string: ["cwd", "reporter", "_"], boolean: ["dev", "doc", "help"], default: { reporter: "dot", coverage: 80 } })
if (args.cwd)
  Deno.chdir(args.cwd)
if (args.help) {
  console.error(`Usage: deno run -A jsr:@libs/toolbox/code-quality <file_test.ts>...`)
  console.error(``)
  console.error(`Options:`)
  console.error(`  --cwd=DIR        Change working directory before running tests (use $INIT_CWD in deno task)`)
  console.error(`  --dev            Only run deno test and deno coverage`)
  console.error(`  --doc            Run documentation checks (default: false)`)
  console.error(`  --reporter=TYPE  Test reporter type (default: dot)`)
  console.error(`  --coverage=NUM   Minimum coverage threshold percentage (default: 80, set to 0 to disable)`)
  console.error(`  --help           Show this help message`)
  console.error(``)
  Deno.exit(2)
}

let success = true
for (const mod_path of args._) {
  if (!mod_path.endsWith("_test.ts"))
    continue
  const mod_test = join(Deno.cwd(), mod_path)
  const mod = mod_test.replace(/_test\.ts$/, ".ts")
  console.error(cyan("─".repeat(80)))
  console.error(cyan(`${mod}`))
  console.error(cyan("─".repeat(80)))
  if (!await exists(mod_test)) {
    console.error(red(`✗ File not found: ${mod_test}`))
    success = false
    continue
  }

  // deno check
  if (args.dev)
    console.error(gray(`∅ deno check`))
  else {
    const check = await new Deno.Command(Deno.execPath(), { args: ["check", "--quiet", mod, mod_test], stdout: "inherit", stderr: "inherit" }).output()
    success &&= check.success
    console.error((check.success ? green : red)(`${check.success ? "✓" : "✗"} deno check`))
  }
  // deno lint
  if (args.dev)
    console.error(gray(`∅ deno lint`))
  else {
    const lint = await new Deno.Command(Deno.execPath(), { args: ["lint", "--quiet", mod, mod_test], stdout: "inherit", stderr: "inherit" }).output()
    success &&= lint.success
    console.error((lint.success ? green : red)(`${lint.success ? "✓" : "✗"} deno lint`))
  }
  // deno fmt
  if (args.dev)
    console.error(gray(`∅ deno fmt --check`))
  else {
    const fmt = await new Deno.Command(Deno.execPath(), { args: ["fmt", "--quiet", "--check", mod, mod_test], stdout: "inherit", stderr: "inherit" }).output()
    success &&= fmt.success
    console.error((fmt.success ? green : red)(`${fmt.success ? "✓" : "✗"} deno fmt --check`))
  }
  // deno test
  const test = await new Deno.Command(Deno.execPath(), {
    args: ["test", "--no-check", "--clean", "--coverage", "--coverage-raw-data-only", "--seed=0", `--reporter=${args.reporter}`, "--sanitize-ops", "--sanitize-resources", "--trace-leaks", "--allow-all", mod_test],
    stdout: "inherit",
    stderr: "inherit",
  }).output()
  success &&= test.success
  console.error((test.success ? green : red)(`${test.success ? "✓" : "✗"} deno test`))
  // deno coverage
  if (test.success) {
    const parsed = Number.parseFloat(`${args.coverage}`)
    const threshold = Number.isFinite(parsed) ? parsed : 80
    const coverage = await new Deno.Command(Deno.execPath(), { args: ["coverage", `--include=${mod}`], stdout: "piped", stderr: "inherit" }).output()
    const result = stripAnsiCode(decoder.decode(coverage.stdout)).trim().match(/^\|\s*All files\s*\|\s*(?<branch>\d+(?:\.\d+)?)\s*\|\s*(?<func>\d+(?:\.\d+)?)\s*\|\s*(?<line>\d+(?:\.\d+)?)\s*\|$/m)?.groups ?? {}
    const branch = Number.parseFloat(result.branch) || 0
    const func = Number.parseFloat(result.func) || 0
    const line = Number.parseFloat(result.line) || 0
    const pass = line >= threshold && branch >= threshold && func >= threshold
    console.error((branch === 100 && func === 100 && line === 100 ? green : pass ? yellow : red)(`${pass ? "✓" : "✗"} deno coverage --threshold=${threshold}%`))
    console.error((branch === 100 ? green : branch >= threshold ? yellow : red)(`  ├─ branch: ${branch.toFixed(1)}%`))
    console.error((func === 100 ? green : func >= threshold ? yellow : red)(`  ├─ function: ${func.toFixed(1)}%`))
    console.error((line === 100 ? green : line >= threshold ? yellow : red)(`  └─ line: ${line.toFixed(1)}%`))
    if ((branch < 100) || (func < 100) || (line < 100))
      await new Deno.Command(Deno.execPath(), { args: ["coverage", "--detailed", `--include=${mod}`], stdout: "inherit", stderr: "inherit" }).output()
  }

  // Documentation checks
  if (args.doc) {
    console.error(gray("┄".repeat(80)))
    // deno doc
    if (basename(mod) === "mod.ts") {
      const doc = await new Deno.Command(Deno.execPath(), { args: ["doc", "--quiet", "--lint", mod], stdout: "inherit", stderr: "inherit" }).output()
      success &&= doc.success
      console.error((doc.success ? green : red)(`${doc.success ? "✓" : "✗"} deno doc --lint`))
    } else {
      console.error(gray(`∅ deno doc --lint`))
    }
    // deno check --doc
    const check = await new Deno.Command(Deno.execPath(), { args: ["check", "--quiet", "--doc-only", mod, mod_test], stdout: "inherit", stderr: "inherit" }).output()
    success &&= check.success
    console.error((check.success ? green : red)(`${check.success ? "✓" : "✗"} deno check --doc`))
    // deno test --doc
    const test = await new Deno.Command(Deno.execPath(), { args: ["test", "--no-check", "--seed=0", `--reporter=${args.reporter}`, "--doc", mod], stdout: "inherit", stderr: "inherit" }).output()
    success &&= test.success
    console.error((test.success ? green : red)(`${test.success ? "✓" : "✗"} deno test --doc`))
  }
}

if (success) {
  console.error(green("─".repeat(80)))
  console.error(green(`✓ Success`))
} else {
  console.error(red("─".repeat(80)))
  console.error(red(`✗ Failure`))
  Deno.exit(1)
}
