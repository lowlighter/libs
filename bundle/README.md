# 🗜️ Bundler

## TypeScript

[`🦕 Playground`](https://dash.deno.com/playground/libs-bundle)

A wrapper around [`deno_emit`](https://github.com/denoland/deno_emit) to bundle and transpile TypeScript to JavaScript.

### Features

- Support for raw TypeScript string input
- Support for banner option
- Minification enabled by default
- Support advanced minification through [Terser](https://terser.org)

### Usage

```ts
import { bundle } from "./typescript.ts"
const base = new URL("testing/bundle/", import.meta.url)

// From string
console.log(await bundle(`console.log("Hello world")`))

// From file
console.log(await bundle(new URL("test_bundle.ts", base)))

// Using an import map
console.log(await bundle(new URL("test_import_map.ts", base), { map: new URL("deno.jsonc", base) }))
```
