// Copyright (c) - 2025+ the lowlighter/libs authors. AGPL-3.0-or-later
import { expect, Status } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { join } from "@std/path/join"
import { sandboxedFetch } from "./fetch.ts"
import { Browser } from "./browser.ts"
import { chromium } from "@libs/toolbox/scripts/download-lambda-chromium"

const fixtures = import.meta.resolve("./testing/fixtures/browser")
const cache = await Deno.makeTempDir({ prefix: "example-test-astral-cache-" })
const binary = await chromium({ path: `${cache}/chromium` })

Deno.test("`Browser.constructor()` instantiates a new instance", async () => {
  await using browser = new Browser()
  expect(browser).toBeInstanceOf(Browser)
})

for (
  const { url, title, blocked } of [
    { url: "https://test.example.app", title: /Example test/ },
    { url: "https://test.example.app/api" },
    { url: "https://blocked.example.app", blocked: true },
  ]
) {
  Deno.test(`\`Browser.page(${inspect(url)})\` is ${blocked ? "blocked" : "intercepted"}`, { permissions: { read: true, env: true, net: ["0.0.0.0", "127.0.0.1"], write: [cache], run: [binary] } }, async () => {
    const ldLibraryPath = Deno.env.get("LD_LIBRARY_PATH")
    const astralBinPath = Deno.env.get("ASTRAL_BIN_PATH")
    const astralBinArgs = Deno.env.get("ASTRAL_BIN_ARGS")
    try {
      Deno.env.set("ASTRAL_BIN_PATH", binary)
      Deno.env.set("ASTRAL_BIN_ARGS", "--no-sandbox")
      Deno.env.delete("LD_LIBRARY_PATH")
      await using browser = new Browser({ fetch: sandboxedFetch([{ hostname: "test.example.app", redirect: `mock://` }], { paths: [join(fixtures, ".test")], browser: true }) }, { cache })
      await using page = await browser.page(url)
      if (title)
        await expect(page.evaluate("document.title")).resolves.toMatch(title)
      await expect(page.evaluate("window.performance.getEntriesByType('navigation')[0].responseStatus")).resolves.toEqual(blocked ? 0 : Status.OK)
    } finally {
      if (astralBinPath)
        Deno.env.set("ASTRAL_BIN_PATH", astralBinPath)
      else
        Deno.env.delete("ASTRAL_BIN_PATH")
      if (astralBinArgs)
        Deno.env.set("ASTRAL_BIN_ARGS", astralBinArgs)
      else
        Deno.env.delete("ASTRAL_BIN_ARGS")
      if (ldLibraryPath)
        Deno.env.set("LD_LIBRARY_PATH", ldLibraryPath)
      else
        Deno.env.delete("LD_LIBRARY_PATH")
    }
  })
}

Deno.test.afterAll(() => Deno.removeSync(cache, { recursive: true }))
