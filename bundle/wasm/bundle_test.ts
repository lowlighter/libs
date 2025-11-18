import { bundle } from "./bundle.ts"
import { expect, test } from "@libs/testing"
import { fromFileUrl } from "@std/path/from-file-url"
import { resolve } from "@std/path"
import { Logger } from "@libs/logger"

const root = fromFileUrl(new URL("testing/", import.meta.url))
const project = resolve(root, "wasm_test")

test("`bundle()` compiles rust projects to wasm", async () => {
  for (const _ of [1, 2]) {
    try {
      await expect(bundle(project, { bin: resolve(root, "wasm-pack", "wasm-pack"), autoinstall: true, logger: new Logger({ level: "disabled" }), env: Deno.env.toObject() })).not.resolves.toThrow()
    } finally {
      await Deno.remove(resolve(root, "wasm-pack"), { recursive: true }).catch(() => null)
    }
  }
}, { permissions: { read: true, write: [root], run: true, env: true, net: ["api.github.com", "github.com", "objects.githubusercontent.com", "release-assets.githubusercontent.com"] } })

test("`bundle()` throws when wasm-pack is not installed", async () => {
  await expect(bundle(project, { bin: resolve(root, "wasm-pack-not-found"), autoinstall: false, logger: new Logger({ level: "disabled" }) })).rejects.toThrow(Deno.errors.NotFound)
}, { permissions: { read: true, run: true } })
