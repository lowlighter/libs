import { expect } from "https://deno.land/std@0.223.0/expect/expect.ts"
import { fromFileUrl } from "https://deno.land/std@0.223.0/path/from_file_url.ts"
import { bundle } from "https://deno.land/x/libs@0.4.0/bundle.ts"

const example = {
  url: new URL("./_example.mjs", import.meta.url),
  path: {
    bun: fromFileUrl(new URL("./_example.mjs", import.meta.url)),
    node: fromFileUrl(new URL("./_example.node.mjs", import.meta.url)),
  },
}

export async function test(runtime: "node" | "bun") {
  try {
    const binary = new Deno.Command(runtime)
    await binary.output()
    let args = []
    switch (runtime) {
      case "node":
        // We also need to transpile to javascript for node
        await Deno.writeTextFile(example.path.node, await bundle(example.url))
        args = [example.path.node]
        break
      case "bun":
        args = ["run", example.path.bun]
        break
      default:
        throw new Error(`Unknown runtime: ${runtime}`)
    }
    Deno.test(`compatibility: ${runtime}`, async () => {
      const command = new Deno.Command(runtime, { args, stdout: "piped", stderr: "piped" })
      const { code, stdout, stderr, success } = await command.output()
      if (!success) {
        console.log(`Command: ${runtime} ${args.join(" ")}`)
        console.error(`Exit code: ${code}`)
        console.log(new TextDecoder().decode(stdout))
        console.error(new TextDecoder().decode(stderr))
      }
      expect(code).toBe(0)
      expect(success).toBe(true)
    })
  } catch (error) {
    if ((!(error instanceof Deno.errors.NotFound)) && (!(error instanceof Deno.errors.PermissionDenied))) {
      throw error
    }
    Deno.test.ignore(`compatibility: ${runtime} (${error})`, () => {})
  }
}
