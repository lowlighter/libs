// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, Status } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { join } from "@std/path/join"
import { mocks } from "./constants.ts"
import { sandboxedFetch } from "./fetch.ts"

for (
  const { rules: _rules, match } of [
    // Protocol
    { match: null, rules: { protocol: "not-scheme:" } },
    { match: {}, rules: { protocol: "scheme:" } },
    // Username
    { match: null, rules: { username: "not-user" } },
    { match: { username: "" }, rules: { username: "user" } },
    { match: { username: "user" }, rules: { username: ":_(user)" } },
    // Password
    { match: null, rules: { password: "not-pass" } },
    { match: { password: "" }, rules: { password: "pass" } },
    { match: { password: "pass" }, rules: { password: ":_(pass)" } },
    // Hostname
    { match: null, rules: { hostname: "not-test.esquie.app" } },
    { match: { hostname: "test.esquie.app" }, rules: { hostname: "test.esquie.app" } },
    // Hostname (without scheme)
    { match: null, rules: [{ hostname: "not-test.esquie.app", redirect: "0.0.0.0:${PORT}" }, { protocol: "not-scheme:", redirect: "http://0.0.0.0:${PORT}" }] },
    { match: { hostname: "test.esquie.app" }, rules: [{ hostname: "test.esquie.app", redirect: "0.0.0.0:${PORT}" }, { protocol: "scheme:", redirect: "http://0.0.0.0:${PORT}" }] },
    // Port
    { match: null, rules: { port: "18080" } },
    { match: { port: "8080" }, rules: { port: "8080" } },
    // Pathname
    { match: null, rules: { pathname: "/path/not-path" } },
    { match: { pathname: "/path/subpath" }, rules: { pathname: "/path/*" } },
    // Pathname (absolute path only)
    { match: null, rules: [{ pathname: "/path/not-path", redirect: "/" }, { protocol: "not-scheme:", redirect: "http://0.0.0.0:${PORT}" }] },
    { match: { pathname: "/path/subpath" }, rules: [{ pathname: "/path/subpath", redirect: "/" }, { protocol: "scheme:", redirect: "http://0.0.0.0:${PORT}" }] },
    // Pathname (with non-empty redirect pathname)
    { match: null, rules: { pathname: "/path/not-path", redirect: "http://0.0.0.0:${PORT}/static" } },
    { match: { pathname: "/static/path/subpath" }, rules: { pathname: "/path/*", redirect: "http://0.0.0.0:${PORT}/static" } },
    // Pathname (with non-empty redirect pathname and captured group)
    { match: null, rules: { pathname: "/path/:_(not-path)", redirect: "http://0.0.0.0:${PORT}/static" } },
    { match: { pathname: "/static/subpath" }, rules: { pathname: "/path/:_(.*)", redirect: "http://0.0.0.0:${PORT}/static" } },
    // Search
    { match: null, rules: { search: "not-foo" } },
    { match: { search: "" }, rules: { search: "*" } },
    { match: { search: "?foo=1&bar=2" }, rules: { search: ":_*" } },
    // Search (with non-empty redirect search)
    { match: null, rules: { search: "?not-foo*", redirect: "http://0.0.0.0:${PORT}/?foo=0&baz=1" } },
    { match: { search: "?foo=1&baz=1&bar=2" }, rules: { search: ":_*", redirect: "http://0.0.0.0:${PORT}/?foo=0&baz=1" } },
    // Hash
    { match: null, rules: { hash: "not-hash" } },
    { match: {/* Not available on server-side */}, rules: { hash: "*" } },
    { match: {/* Not available on server-side */}, rules: { hash: ":_*" } },
    // Case sensitivity
    { match: { pathname: "/path/subpath" }, rules: { pathname: "/path/*", ignoreCase: false } },
    { match: null, rules: { pathname: "/PATH/*", ignoreCase: false } },
    { match: { pathname: "/path/subpath" }, rules: { pathname: "/path/*", ignoreCase: true } },
    { match: { pathname: "/path/subpath" }, rules: { pathname: "/PATH/*", ignoreCase: true } },
  ]
) {
  const url = "scheme://user:pass@test.esquie.app:8080/path/subpath?foo=1&bar=2#hash"
  const rules = [_rules].flat().map((rule) => ({ redirect: "http://0.0.0.0:${PORT}", ...rule }))
  Deno.test(`\`sandboxedFetch(url)\` with \`${inspect(rules.map((rule) => ({ ...rule, redirect: rule.redirect.replace("0.0.0.0:${PORT}", "esquie.test") })))})}\` ${match ? `is redirected and matches \`${inspect(match)}\`` : "is not redirected"}`, {
    permissions: { net: ["0.0.0.0"] },
  }, async () => {
    await using server = Deno.serve({ port: 0, onListen: () => null }, (request) => {
      const url = new URL(request.url)
      if (request.headers.has("authorization")) {
        const auth = atob(request.headers.get("authorization")!.replace("Basic ", ""))
        ;[url.username, url.password] = auth.split(":")
      }
      if (url.hostname === "0.0.0.0") {
        url.hostname = "test.esquie.app"
        url.port = "8080"
      }
      expect(url).toMatchObject(match!)
      return new Response(null, { status: Status.Teapot })
    })
    const response = sandboxedFetch(rules.map((rule) => ({ ...rule, redirect: rule.redirect.replace("${PORT}", `${server.addr.port}`) })))(url)
    if (match)
      await expect(response).resolves.toRespondWithStatus(Status.Teapot)
    else
      await expect(response).rejects.toThrow()
  })
}

for (
  const { name, url, rules, status } of [
    // Normal fetch
    { name: "supports normal fetch", url: null, rules: [], status: Status.Teapot },
    // HTTP mocks
    { name: "supports serving static directory with intercepted requests", url: "https://test.esquie.app", rules: [{ hostname: "*", redirect: `${mocks.protocol}://` }], status: Status.OK },
    { name: "supports serving mock handlers responses with intercepted requests", url: "https://test.esquie.app/api/test", rules: [{ hostname: "*", pathname: "/api/*", redirect: `${mocks.protocol}://` }], status: Status.OK },
    { name: "supports serving mock handlers responses with intercepted requests (with fallback)", url: "https://test.esquie.app/api/fallback", rules: [{ hostname: "*", pathname: "/api/*", redirect: `${mocks.protocol}://` }], status: Status.OK },
    { name: "returns 502 Bad Gateway on unmocked intercepted requests", url: "https://unmocked.test.esquie.app", rules: [{ hostname: "*", redirect: `${mocks.protocol}://` }], status: Status.BadGateway },
    { name: "supports serving inline-mocks with intercepted requests", url: "https://test.esquie.app", rules: [{ hostname: "*", respond: { status: Status.Accepted } }], status: Status.Accepted },
  ]
) {
  Deno.test(`\`sandboxedFetch(url)\` ${name}`, { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
    await using server = Deno.serve({ port: 0, onListen: () => null }, () => new Response(null, { status: Status.Teapot }))
    const request = url ?? new Request(`http://0.0.0.0:${server.addr.port}`)
    const response = sandboxedFetch(rules, { paths: [join(mocks.fixtures.fetch, mocks.tld, "mod/mod.ts"), join(mocks.fixtures.fetch, mocks.tld)] })(request)
    await expect(response).resolves.toRespondWithStatus(status)
  })
}

Deno.test(`\`sandboxedFetch(url, ${inspect({ browser: true })})\` returns ${inspect(null)} on non-intercepted requests`, { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
  await expect(sandboxedFetch([{ hostname: "*", redirect: `${mocks.protocol}://` }], { paths: [join(mocks.fixtures.fetch, mocks.tld)], browser: true })(new Request("https://test.esquie.app"))).resolves.toRespondWithStatus(Status.OK)
  await expect(sandboxedFetch([], { paths: [join(mocks.fixtures.fetch, mocks.tld)], browser: true })(new Request("https://test.esquie.app"))).resolves.toBeNull()
})
