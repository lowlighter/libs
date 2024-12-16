// deno-lint-ignore-file no-console no-external-import
// Example module with specifiers
import { red } from "jsr:@std/fmt/colors"
import { inspect } from "node:util"
console.log(red, inspect)
console.log("success" as string)
