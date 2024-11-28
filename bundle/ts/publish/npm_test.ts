import { fromFileUrl } from "@std/path/from-file-url"
import { packaged, publish } from "./npm.ts"
import { expect, test } from "@libs/testing"
import { Logger } from "@libs/logger"

const path = fromFileUrl(new URL("../testing/deno.jsonc", import.meta.url))

test("`packaged()` parses `deno.jsonc` to `package.json` and other metadata", async () => {
  await expect(packaged(path)).resolves.toMatchObject({
    scope: "@libs",
    name: "bundle-test",
    json: {
      name: "@libs/bundle-test",
      version: "0.0.0",
      type: "module",
      scripts: {},
      description: "A dummy package used for testing.",
      exports: {
        ".": "./test_bundle.mjs",
      },
    },
    exports: {
      "./test_bundle.mjs": 'console.log("success");',
    },
  })
}, { permissions: "inherit" })

test("`publish()` publishes `deno.jsonc` to npm", async () => {
  await expect(publish(path, { logger: new Logger({ level: "disabled" }), scope: "@testing", dryrun: true, provenance: true, registries: [{ url: "https://registry.npmjs.example.com", token: "npm_otp", access: "public" }] })).resolves.toMatchObject({
    scope: "@testing",
    name: "bundle-test",
  })
}, { permissions: "inherit" })
