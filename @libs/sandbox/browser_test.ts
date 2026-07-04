// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, Status } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { join } from "@std/path/join"
import { mocks } from "./constants.ts"
import { sandboxedFetch } from "./fetch.ts"
import { Browser } from "./browser.ts"

const cache = await Deno.makeTempDir({ prefix: "esquie-test-astral-cache-" })

Deno.test("`Browser.constructor()` instantiates a new instance", async () => {
  await using browser = new Browser()
  expect(browser).toBeInstanceOf(Browser)
})

for (
  const { url, title, blocked } of [
    { url: "https://test.esquie.app", title: /Esquie Test/ },
    { url: "https://test.esquie.app/api" },
    { url: "https://blocked.esquie.app", blocked: true },
  ]
) {
  Deno.test(`\`Browser.page(${inspect(url)})\` is ${blocked ? "blocked" : "intercepted"}`, { permissions: { read: true, env: true, net: ["0.0.0.0", "127.0.0.1"], write: [cache], run: [Deno.env.get("ASTRAL_BIN_PATH")!] } }, async () => {
    await using browser = new Browser({ fetch: sandboxedFetch([{ hostname: "test.esquie.app", redirect: `${mocks.protocol}://` }], { paths: [join(mocks.fixtures.browser, mocks.tld)], browser: true }) }, { cache })
    await using page = await browser.page(url)
    if (title)
      await expect(page.evaluate("document.title")).resolves.toMatch(title)
    await expect(page.evaluate("window.performance.getEntriesByType('navigation')[0].responseStatus")).resolves.toEqual(blocked ? 0 : Status.OK)
  })
}

Deno.test.afterAll(() => Deno.removeSync(cache, { recursive: true }))
