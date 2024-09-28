import { expandGlob } from "jsr:@std/fs@1/expand-glob"
import { parse } from "../mod.ts"
import { parse as parse_v5 } from "jsr:@libs/xml@5.0.2/parse"
import { parse as parse_v4 } from "https://deno.land/x/xml@4.0.0/parse.ts"
import { parse as parse_v3 } from "https://deno.land/x/xml@3.0.2/parse.ts"

for await (const { name, path } of expandGlob("**/!(x-)*.xml", { globstar: true })) {
  const { size } = await (await Deno.open(path)).stat()
  for (const [func, f] of Object.entries({ parse, parse_v5, parse_v4, parse_v3 })) {
    Deno.bench(`${func}(): ${name}, ${size}b)`, async function (t) {
      const content = await Deno.readTextFile(path)
      t.start()
      f(content)
      t.end()
    })
  }
}
