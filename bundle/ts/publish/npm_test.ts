import { fromFileUrl } from "@std/path/from-file-url"
import { packaged, publish } from "./npm.ts"
import { expect, test } from "@libs/testing"
import { Logger } from "@libs/logger"

const path = fromFileUrl(new URL("../testing/deno.jsonc", import.meta.url))

test("deno")("packaged() parses deno.jsonc to package.json and other metadata", async () => {
  await expect(packaged(path)).resolves.toMatchObject({
    scope: "@libs",
    name: "test",
    json: {
      name: "@libs/test",
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

test("deno")("publish() publishes deno.jsonc to npm", async () => {
  await expect(publish(path, { log: new Logger({ level: Logger.level.disabled }), scope: "@testing", dryrun: true, provenance: true, registries: [{ url: "https://registry.npmjs.example.com", token: "npm_otp", access: "public" }] })).resolves.toMatchObject({
    scope: "@testing",
    name: "test",
  })
}, { permissions: "inherit" })
