//Imports
import { expandGlob } from "https://deno.land/std@0.223.0/fs/expand_glob.ts"
import { parse } from "../../mod.ts"

//Huge xml file generator
async function write({ path, size }: { path: string; size: number }) {
  const file = await Deno.open(path, { write: true, truncate: true, create: true })
  const encoder = new TextEncoder()
  await file.write(encoder.encode("<root>"))
  for (let i = 0; i < size * 3100; i++) {
    await file.write(encoder.encode(`<child>${Math.random()}</child>`))
  }
  await file.write(encoder.encode("</root>"))
}
await write({ path: "utils/tests/assets/x-large.xml", size: 0.2 })
await write({ path: "utils/tests/assets/x-xlarge.xml", size: 0.5 })
await write({ path: "utils/tests/assets/x-xxlarge.xml", size: 1 })

//Benchmarks
for await (const { name, path } of expandGlob("**/*.xml", { globstar: true })) {
  const { size } = await (await Deno.open(path)).stat()
  for (const mode of (size > 2 ** 13 ? ["stream"] : ["stream", "text"])) {
    Deno.bench(`parse: ${name} (${mode}, ${size}b)`, async function (t) {
      const content = mode === "stream" ? await Deno.open(path) : await Deno.readTextFile(path)
      t.start()
      parse(content)
      t.end()
    })
  }
}
