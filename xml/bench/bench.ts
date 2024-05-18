//Imports
import { expandGlob } from "@std/fs/expand-glob"
import { parse } from "../mod.ts"
import { fromFileUrl } from "@std/path/from-file-url"

//Huge xml file generator
async function write({ path, size }: { path: string; size: number }) {
  const file = await Deno.open(fromFileUrl(import.meta.resolve(path)), { write: true, truncate: true, create: true })
  const encoder = new TextEncoder()
  await file.write(encoder.encode("<root>"))
  for (let i = 0; i < size * 3100; i++) {
    await file.write(encoder.encode(`<child>${Math.random()}</child>`))
  }
  await file.write(encoder.encode("</root>"))
}
await write({ path: "./assets/x-large.xml", size: 0.2 })
await write({ path: "./assets/x-xlarge.xml", size: 0.5 })
await write({ path: "./assets/x-xxlarge.xml", size: 1 })

//Benchmarks
for await (const { name, path } of expandGlob("**/*.xml", { globstar: true })) {
  const { size } = await (await Deno.open(path)).stat()
  Deno.bench(`parse(): ${name}, ${size}b)`, async function (t) {
    const content = await Deno.readTextFile(path)
    t.start()
    parse(content)
    t.end()
  })
}
