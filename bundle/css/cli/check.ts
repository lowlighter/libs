/**
 * CLI utility to check CSS browser support
 *
 * @module
 */

// Imports
import { compatibility } from "../compatibility.ts"
import { parseArgs } from "@std/cli"

const { help, query, html, ["no-style"]: nostyle, details, _: [url] } = parseArgs(Deno.args, { boolean: ["html", "help", "no-style", "details"], alias: { help: "h", query: "q", "no-style": "S", details: "d" }, string: ["query"], collect: ["query"] })
if (help) {
  console.log("CSS compatibility checker")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-net --allow-env fmt.ts [options] <url>")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                  Show this help")
  console.log("  [-q, --query=defaults]      Browser list query (can be used multiple times) [see https://browserl.ist for more information]")
  console.log("  -d, --details               Show detailed information about browser support")
  console.log("  --html                      Generate HTML <table> output instead of printing to console")
  console.log("  -S, --no-style              Do not return <style> tag for HTML output")
  console.log("")
  console.log("Examples:")
  console.log("")
  console.log("  Check compatibility of a css file:")
  console.log("    deno run --allow-read --allow-net --allow-env check.ts https://matcha.mizu.sh/matcha.css")
  console.log("")
  Deno.exit(0)
}

if (!query.length) {
  query.push("defaults")
}
await compatibility(new URL(`${url}`), { query, output: html ? "html" : "console", verbose: details, style: !nostyle })
