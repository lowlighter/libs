// deno-lint-ignore-file no-console no-external-import no-import-prefix
// Example module with specifiers
import { red } from "jsr:@std/fmt@1/colors"
import { inspect } from "node:util"
console.log(red, inspect)
console.log("success" as string)
