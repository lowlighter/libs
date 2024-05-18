import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { encodeBase64 } from "jsr:@std/encoding/base64"
import {bgCyan} from "jsr:@std/fmt/colors"
import {bundle} from "jsr:@libs/bundle/typescript"

const name = "wasm_xml_parser"

console.log(bgCyan("wasm build".padEnd(48)))
const command = new Deno.Command("wasm-pack", {args:["build", "--release", "--target", "web"], cwd:import.meta.dirname, stdin:"inherit", stdout:"inherit", stderr:"inherit"})
const {success} = await command.output()
if (!success)
    throw new Error("wasm build failed")

console.log(bgCyan("inject base64 wasm to js".padEnd(48)))
const wasm = await fetch(import.meta.resolve(`./pkg/${name}_bg.wasm`)).then(response => response.arrayBuffer())
const js = await fetch(import.meta.resolve(`./pkg/${name}.js`)).then(response => response.text())
if (!js.includes(`'${name}_bg.wasm'`))
    throw new Error("failed to find injection location")
await Deno.writeTextFile(fromFileUrl(import.meta.resolve(`./${name}.js`)), js.replace(`'${name}_bg.wasm'`, `'data:application/wasm;base64,${encodeBase64(wasm)}'`))
console.log("ok")

console.log(bgCyan("minify js".padEnd(48)))
const minified = await bundle(new URL(import.meta.resolve(`./${name}.js`)), {minify:"terser", banner:"WASM XML parser - https://github.com/lowlighter/xml"})
await Deno.writeTextFile(fromFileUrl(import.meta.resolve(`./${name}.js`)), minified)
console.log(`size: ${new Blob([minified]).size}b`)