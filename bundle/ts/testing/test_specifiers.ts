// deno-lint-ignore-file no-console no-external-import
// Example module with specifiers
import { red } from "jsr:@std/fmt/colors"
import zod from "npm:zod"
import { inspect } from "node:util"
console.log(red, zod, inspect)
console.log("success" as string)
