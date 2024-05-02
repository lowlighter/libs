import { expect } from "jsr:@std/expect/expect"
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { bundle } from "jsr:@libs/bundle@1/typescript"

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
