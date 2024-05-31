// Example module with specifiers
import { red } from "jsr:@std/fmt/colors"
import lodash from "npm:lodash"
import { inspect } from "node:util"
console.log(red, lodash, inspect)
console.log("success" as string)
